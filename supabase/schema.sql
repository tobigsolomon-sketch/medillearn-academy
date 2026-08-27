-- MediLearn Academy — core schema for Phase 1
-- (public site + auth + course browsing/enrollment)
--
-- Run this in the Supabase SQL editor, or via `supabase db push` if you're
-- using the CLI with migrations. Safe to re-run: guarded with IF NOT EXISTS
-- / OR REPLACE wherever practical.

-- ============================================================================
-- Extensions
-- ============================================================================
create extension if not exists "pgcrypto";

-- ============================================================================
-- Enums
-- ============================================================================
do $$ begin
  create type app_role as enum ('student', 'instructor', 'admin', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type course_level as enum ('foundation', 'intermediate', 'advanced');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enrollment_status as enum ('pending', 'approved', 'rejected', 'suspended');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- Tables
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  date_of_birth date,
  country text,
  educational_background text,
  student_id text unique,
  role app_role not null default 'student',
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  description text not null,
  objectives text[],
  requirements text[],
  level course_level not null default 'foundation',
  duration_weeks int not null default 4,
  module_count int not null default 1,
  instructor_name text not null default 'MediLearn Faculty',
  cover_image_url text,
  rating numeric(2,1),
  enrollment_count int not null default 0,
  is_published boolean not null default false,
  is_free boolean not null default true,
  price_cents int,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  status enrollment_status not null default 'pending',
  applied_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references public.profiles (id),
  note text,
  unique (student_id, course_id)
);

-- Minimal certificates table so /verify-certificate has something real to
-- query. The full issuance workflow (section 17 of the product spec) is a
-- later phase; this just makes verification lookups functional now.
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_id text not null unique,
  student_id uuid not null references public.profiles (id),
  course_id uuid not null references public.courses (id),
  issued_at timestamptz not null default now()
);

create index if not exists idx_enrollments_student on public.enrollments (student_id);
create index if not exists idx_enrollments_course on public.enrollments (course_id);
create index if not exists idx_courses_published on public.courses (is_published);

-- ============================================================================
-- New-user trigger: create a profile row automatically on signup
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- Helper: is the current user staff (admin/super_admin/instructor)?
-- ============================================================================
create or replace function public.is_staff()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin', 'instructor')
  );
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.certificates enable row level security;

-- profiles: users read/update their own row; staff can read all
drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff"
  on public.profiles for select
  using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

-- courses: anyone (incl. anonymous) can read published courses; staff manage all
drop policy if exists "courses_select_published" on public.courses;
create policy "courses_select_published"
  on public.courses for select
  using (is_published = true or public.is_staff());

drop policy if exists "courses_write_staff" on public.courses;
create policy "courses_write_staff"
  on public.courses for all
  using (public.is_staff())
  with check (public.is_staff());

-- enrollments: students see/apply for their own; staff see/manage all
drop policy if exists "enrollments_select_own_or_staff" on public.enrollments;
create policy "enrollments_select_own_or_staff"
  on public.enrollments for select
  using (student_id = auth.uid() or public.is_staff());

drop policy if exists "enrollments_insert_own" on public.enrollments;
create policy "enrollments_insert_own"
  on public.enrollments for insert
  with check (student_id = auth.uid());

drop policy if exists "enrollments_update_staff" on public.enrollments;
create policy "enrollments_update_staff"
  on public.enrollments for update
  using (public.is_staff())
  with check (public.is_staff());

-- certificates: no direct table access from clients; only via the
-- verify_certificate() RPC below, which returns a narrow, public-safe shape
drop policy if exists "certificates_no_direct_access" on public.certificates;
create policy "certificates_no_direct_access"
  on public.certificates for select
  using (public.is_staff());

-- ============================================================================
-- Public certificate verification RPC
-- Runs as the function owner so it can read certificates despite RLS,
-- but only ever returns the narrow public fields below.
-- ============================================================================
create or replace function public.verify_certificate(cert_id text)
returns table (
  certificate_id text,
  student_name text,
  course_title text,
  issued_at timestamptz
)
language sql
security definer set search_path = public
stable
as $$
  select c.certificate_id, p.full_name, co.title, c.issued_at
  from public.certificates c
  join public.profiles p on p.id = c.student_id
  join public.courses co on co.id = c.course_id
  where c.certificate_id = cert_id;
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;

-- ============================================================================
-- Seed data (safe to delete once you have real courses)
-- ============================================================================
insert into public.courses
  (slug, title, tagline, description, objectives, requirements, level, duration_weeks, module_count, instructor_name, rating, enrollment_count, is_published, is_free)
values
  (
    'human-anatomy-foundations',
    'Human Anatomy Foundations',
    'A structured tour of the body systems every clinician needs cold.',
    'This course builds a working map of human anatomy from the skeletal system through to the major organ systems, using annotated imaging and short recall quizzes after every module.',
    array['Identify major bones, joints, and muscle groups', 'Describe the structure and function of core organ systems', 'Apply anatomical terminology correctly in clinical notes'],
    array['No prior anatomy coursework required', 'Comfortable reading labeled diagrams'],
    'foundation', 6, 5, 'Dr. Linda Owusu', 4.8, 1240, true, true
  ),
  (
    'clinical-first-aid-emergency-response',
    'Clinical First Aid & Emergency Response',
    'Assess, stabilize, and hand off — the sequence that saves minutes.',
    'A practical course on primary assessment, airway management, hemorrhage control, and safe handoff, built around realistic scenario walkthroughs rather than checklists alone.',
    array['Perform a structured primary survey under time pressure', 'Control bleeding and manage shock in the field', 'Hand off a patient using a standard clinical format'],
    array['Basic anatomy knowledge recommended'],
    'intermediate', 4, 4, 'Kwabena Mensah, EMT-P', 4.9, 860, true, true
  ),
  (
    'advanced-cardiac-life-support-prep',
    'Advanced Cardiac Life Support — Exam Prep',
    'Rhythm recognition and algorithm drills for ACLS certification.',
    'A focused review course covering rhythm interpretation, the core ACLS algorithms, and timed practice exams that mirror the real certification format.',
    array['Interpret common cardiac rhythms from a strip', 'Apply the correct ACLS algorithm under time pressure', 'Pass a timed practice exam at the required threshold'],
    array['Active BLS certification', 'Prior clinical or nursing coursework'],
    'advanced', 3, 3, 'Dr. Samuel Asante', 4.7, 410, true, false
  )
on conflict (slug) do nothing;
