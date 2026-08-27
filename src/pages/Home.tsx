import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Stethoscope,
  ShieldCheck,
  ClipboardCheck,
  Activity,
  Award,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { VitalRule } from '../components/VitalRule'
import { CourseCard } from '../components/CourseCard'
import { useCourses } from '../hooks/useCourses'

const valueProps = [
  {
    icon: Stethoscope,
    title: 'Expert-built curricula',
    body: 'Every course is written and reviewed by practicing clinicians and medical educators, not generic content mills.',
  },
  {
    icon: Activity,
    title: 'Interactive lessons',
    body: 'Video demonstrations, annotated imaging, and case walkthroughs replace passive slide decks.',
  },
  {
    icon: ShieldCheck,
    title: 'Protected resources',
    body: 'Lecture recordings and reference material stay behind authenticated, permissioned access — never a public link.',
  },
  {
    icon: ClipboardCheck,
    title: 'Real assessment',
    body: 'Timed quizzes, graded assignments, and proctored-style exams confirm competence before you move on.',
  },
  {
    icon: Activity,
    title: 'Progress you can see',
    body: 'Module-by-module tracking shows exactly what is complete and what is left before certification.',
  },
  {
    icon: Award,
    title: 'Verifiable certificates',
    body: 'Every certificate carries a unique ID and QR code that anyone can check on our public verification page.',
  },
]

const steps = [
  { title: 'Create an account', body: 'Register with your name, email, and background in under two minutes.' },
  { title: 'Apply for a course', body: 'Browse the catalog and submit an application for the course you need.' },
  { title: 'Get approved', body: 'An administrator reviews your application and activates your enrollment.' },
  { title: 'Start learning', body: 'Work through modules at your own pace, with progress saved as you go.' },
  { title: 'Complete assessments', body: 'Pass the quizzes, assignments, and exams built into each module.' },
  { title: 'Earn your certificate', body: 'Receive a certificate with a verifiable ID once requirements are met.' },
]

const stats = [
  { value: '12,400+', label: 'Students trained' },
  { value: '48', label: 'Active courses' },
  { value: '860', label: 'Recorded lessons' },
  { value: '9,100+', label: 'Certificates issued' },
]

const testimonials = [
  {
    quote:
      'The module structure mirrors how we actually teach on the ward — I could follow along between shifts without losing my place.',
    name: 'Ama Boateng',
    role: 'Third-year nursing student',
  },
  {
    quote:
      'Having every lecture, quiz, and deadline in one place made it far easier to stay accountable through the whole course.',
    name: 'Kwabena Mensah',
    role: 'Emergency care trainee',
  },
  {
    quote:
      'The certificate verification page gave our hiring team confidence the credential was genuine before we even called the candidate.',
    name: 'Dr. Linda Owusu',
    role: 'Clinical education lead',
  },
]

const faqs = [
  {
    q: 'How is my application reviewed?',
    a: 'After you apply, an administrator checks your background against the course requirements and either approves, rejects, or requests more information. You will be notified either way.',
  },
  {
    q: 'Can I download lecture videos and notes?',
    a: 'That depends on the resource. Instructors decide, per resource, whether downloading is permitted. Where it is not, you can still view the material as many times as you need inside the platform.',
  },
  {
    q: 'How do certificates get verified?',
    a: 'Every certificate has a unique ID and QR code. Anyone — an employer, a licensing body — can enter that ID on our public verification page to confirm it is genuine.',
  },
  {
    q: 'Can I use MediLearn on my phone?',
    a: 'Yes. MediLearn is a Progressive Web App, so you can install it from your browser onto your phone or desktop and use it like a native app, including offline access to your course outline.',
  },
]

export function Home() {
  const { courses, loading } = useCourses({ limit: 3 })
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden chart-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-paper)]/40 to-[var(--color-paper)] dark:via-[var(--color-navy-950)]/40 dark:to-[var(--color-navy-950)]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-teal-500)] bg-[var(--color-teal-100)] dark:bg-white/5 px-3 py-1.5 rounded-full">
              <Activity size={13} /> Clinical education, structured
            </span>
            <h1 className="mt-6 font-display font-semibold text-4xl sm:text-6xl leading-[1.05] tracking-tight text-[var(--color-navy-900)] dark:text-white">
              MediLearn Academy
            </h1>
            <p className="mt-3 font-mono text-sm sm:text-base tracking-wide text-[var(--color-teal-600)] dark:text-[var(--color-teal-400)]">
              LEARN. PRACTICE. CERTIFY. SAVE LIVES.
            </p>
            <p className="mt-6 text-lg text-[var(--color-ink-soft)] dark:text-white/60 max-w-xl leading-relaxed">
              Access professional medical education, interactive courses, protected learning
              resources, assessments and recognized certificates from anywhere.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--color-navy-800)] text-white font-semibold hover:bg-[var(--color-navy-700)] transition-colors"
              >
                Explore Courses <ArrowRight size={16} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-black/10 dark:border-white/20 text-[var(--color-navy-900)] dark:text-white font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <VitalRule className="relative" />
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-teal-500)]">
              Catalog
            </span>
            <h2 className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
              Featured courses
            </h2>
          </div>
          <Link
            to="/courses"
            className="hidden sm:inline-flex text-sm font-semibold text-[var(--color-teal-500)] items-center gap-1"
          >
            View all courses <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/15 p-10 text-center text-[var(--color-ink-soft)] dark:text-white/50">
            No courses published yet. Once an administrator publishes a course, it will appear
            here.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      {/* Why MediLearn */}
      <section className="bg-white dark:bg-[var(--color-navy-900)]/40 border-y border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-teal-500)]">
            Why MediLearn
          </span>
          <h2 className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white max-w-lg">
            Built like a teaching hospital, not a video library
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {valueProps.map((v) => (
              <div key={v.title} className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[var(--color-teal-100)] dark:bg-white/5 grid place-items-center text-[var(--color-navy-800)] dark:text-[var(--color-teal-400)]">
                  <v.icon size={18} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[var(--color-navy-900)] dark:text-white">
                    {v.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-ink-soft)] dark:text-white/60 leading-relaxed">
                    {v.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-teal-500)]">
          Process
        </span>
        <h2 className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
          How it works
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {steps.map((s, i) => (
            <div key={s.title} className="relative pl-14">
              <span className="absolute left-0 top-0 font-mono text-2xl font-medium text-[var(--color-teal-300)] dark:text-white/15">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display font-semibold text-[var(--color-navy-900)] dark:text-white">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] dark:text-white/60 leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[var(--color-navy-900)] dark:bg-[var(--color-navy-950)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-semibold text-3xl sm:text-4xl text-white">
                {s.value}
              </div>
              <div className="mt-1.5 text-xs font-mono uppercase tracking-wide text-white/50">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-teal-500)]">
          Testimonials
        </span>
        <h2 className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
          From students on the platform
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl bg-white dark:bg-[var(--color-navy-900)] border border-black/5 dark:border-white/10 p-6 flex flex-col"
            >
              <blockquote className="text-sm leading-relaxed text-[var(--color-ink)] dark:text-white/80 flex-1">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 pt-5 border-t border-black/5 dark:border-white/10">
                <div className="font-display font-semibold text-sm text-[var(--color-navy-900)] dark:text-white">
                  {t.name}
                </div>
                <div className="text-xs text-[var(--color-ink-soft)] dark:text-white/50">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white dark:bg-[var(--color-navy-900)]/40 border-y border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-teal-500)]">
            FAQ
          </span>
          <h2 className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
            Common questions
          </h2>
          <div className="mt-10 divide-y divide-black/5 dark:divide-white/10">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-display font-semibold text-[var(--color-navy-900)] dark:text-white">
                    {f.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[var(--color-ink-soft)] transition-transform ${
                      openFaq === i ? 'rotate-180 text-[var(--color-teal-500)]' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <p className="pb-5 text-sm text-[var(--color-ink-soft)] dark:text-white/60 leading-relaxed max-w-2xl">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-24 text-center">
        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-navy-900)] dark:text-white max-w-2xl mx-auto">
          Start your medical learning journey today
        </h2>
        <div className="mt-8 flex justify-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--color-navy-800)] text-white font-semibold hover:bg-[var(--color-navy-700)] transition-colors"
          >
            Create your account <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
