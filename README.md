# MediLearn Academy — Phase 1

Public site, student authentication, and course browsing/enrollment for
MediLearn Academy, built as an installable Progressive Web App.

This is **phase 1** of the full product spec: the public marketing site,
student registration/login, course catalog, course detail pages, and the
apply-for-course → pending → approved enrollment flow, plus a basic student
dashboard. Admin approval UI, the learning/quiz/exam system, video
streaming, certificate issuance, and the admin panel are later phases — the
schema and RLS policies here are written so those phases can build on top
without rework.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- React Router
- Supabase (Postgres, Auth, Row Level Security)
- PWA: web manifest + service worker (installable, app-shell offline cache)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure Supabase**

   Copy `.env.example` to `.env` and fill in your project's URL and anon
   key (Supabase dashboard → Project Settings → API):

   ```bash
   cp .env.example .env
   ```

3. **Apply the database schema**

   Open the Supabase SQL editor for your project and run the contents of
   `supabase/schema.sql`. It creates the `profiles`, `courses`,
   `enrollments`, and `certificates` tables, sets up Row Level Security,
   adds a trigger that creates a profile row on signup, and seeds three
   sample published courses so the site has something to show immediately.

   It's idempotent — safe to re-run if you tweak it.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

## How the enrollment flow works

- Anyone can browse `/courses` and view a course's detail page — course
  rows are readable by anonymous visitors once `is_published = true`.
- Applying for a course requires an account. On apply, an `enrollments`
  row is created with `status = 'pending'`.
- Only staff (`admin` / `super_admin` / `instructor` roles in `profiles`)
  can move an enrollment to `approved`, `rejected`, or `suspended` — this
  is enforced by RLS, not just the UI, so it holds even if someone calls
  the Supabase API directly.
- The student dashboard (`/student/dashboard`) reads the student's own
  enrollments joined with course data and shows status.

To manually make yourself an admin while there's no admin UI yet, run this
in the SQL editor after signing up:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Then you can approve enrollments directly in the Supabase table editor
until the admin panel (a later phase) exists.

## PWA / install behavior

- `public/manifest.json` and `public/sw.js` implement installability.
- The service worker only caches the static app shell (`/`, manifest,
  icons). It explicitly bypasses Supabase API calls and any
  `/storage/` or `/api/` paths, so protected course content and
  auth/session data are never served from a stale cache.
- `src/components/InstallPrompt.tsx` shows a dismissible install card
  when the browser fires `beforeinstallprompt` (Chrome/Edge/Android).
  iOS Safari doesn't support that event — users add to home screen via
  the native Share menu instead, same as any PWA on iOS.
- The service worker only registers in production builds
  (`npm run build && npm run preview`), not in `npm run dev`, so it
  doesn't interfere with Vite's dev server or hot reload.

## What's next (later phases)

- Admin dashboard: approve/reject enrollments, manage courses/modules,
  manage resource download permissions.
- Protected lesson/video player with per-resource download toggles and
  signed storage URLs.
- Quizzes, assignments, exams, and progress tracking.
- Certificate issuance (the `certificates` table and public
  `verify_certificate()` RPC already exist and are wired into
  `/verify-certificate` — issuance just needs to insert rows into it).
- Notifications and announcements.

## Deployment

- **Frontend**: deploy as a static Vite build to Vercel, Netlify, or
  similar. Build command: `npm run build`, output directory: `dist`.
- **Database/Auth/Storage**: Supabase (already configured via env vars).
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment
  variables in your hosting provider — never commit real values.
