import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, ChevronDown } from 'lucide-react'
import { StaticPage } from './StaticPage'

export function About() {
  return (
    <StaticPage eyebrow="About" title="Medical education, taken seriously">
      <p>
        MediLearn Academy exists to close the gap between clinical training material and how
        clinicians actually study — in short sessions, between shifts, revisiting the same
        material until it's automatic.
      </p>
      <p>
        Every course on the platform is written by practicing medical educators and reviewed
        before publication. Access to lecture recordings and reference material is permissioned
        per student, per resource, so instructors keep control over how their material is used.
      </p>
      <p>
        Completion is backed by real assessment — quizzes, assignments, and exams — and every
        certificate we issue can be verified independently, without needing to contact us
        directly.
      </p>
    </StaticPage>
  )
}

export function Contact() {
  const [sent, setSent] = useState(false)
  return (
    <StaticPage eyebrow="Contact" title="Get in touch">
      <div className="grid sm:grid-cols-3 gap-6 not-prose text-sm">
        <div className="flex items-center gap-2.5 text-[var(--color-navy-900)] dark:text-white">
          <Mail size={16} className="text-[var(--color-teal-500)]" /> support@medilearn.academy
        </div>
        <div className="flex items-center gap-2.5 text-[var(--color-navy-900)] dark:text-white">
          <Phone size={16} className="text-[var(--color-teal-500)]" /> +233 20 000 0000
        </div>
        <div className="flex items-center gap-2.5 text-[var(--color-navy-900)] dark:text-white">
          <MapPin size={16} className="text-[var(--color-teal-500)]" /> Kumasi, Ghana
        </div>
      </div>

      {sent ? (
        <div className="mt-8 rounded-2xl bg-[var(--color-teal-100)] dark:bg-[var(--color-teal-500)]/10 p-5 text-[var(--color-teal-600)] dark:text-[var(--color-teal-400)] text-sm font-medium not-prose">
          Thanks — we'll get back to you within one business day.
        </div>
      ) : (
        <form
          className="mt-8 space-y-4 not-prose"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
        >
          <input
            required
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm text-[var(--color-ink)] dark:text-white"
          />
          <input
            required
            type="email"
            placeholder="Your email"
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm text-[var(--color-ink)] dark:text-white"
          />
          <textarea
            required
            rows={4}
            placeholder="How can we help?"
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm text-[var(--color-ink)] dark:text-white"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-[var(--color-navy-800)] text-white text-sm font-semibold hover:bg-[var(--color-navy-700)] transition-colors"
          >
            Send message
          </button>
        </form>
      )}
    </StaticPage>
  )
}

const faqItems = [
  {
    q: 'Is MediLearn free to use?',
    a: 'Some courses are free; others are paid. Each course page shows whether it is free before you apply.',
  },
  {
    q: 'How long does approval take?',
    a: 'Most applications are reviewed within a few business days. You will see your status update on your dashboard.',
  },
  {
    q: 'Can instructors see my progress?',
    a: 'Yes — instructors and administrators for your enrolled courses can see your completion and assessment scores in order to support your learning.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <StaticPage eyebrow="Support" title="Frequently asked questions">
      <div className="not-prose divide-y divide-black/5 dark:divide-white/10">
        {faqItems.map((f, i) => (
          <div key={f.q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-display font-semibold text-[var(--color-navy-900)] dark:text-white">
                {f.q}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-[var(--color-ink-soft)] transition-transform ${open === i ? 'rotate-180 text-[var(--color-teal-500)]' : ''}`}
              />
            </button>
            {open === i && (
              <p className="pb-5 text-sm text-[var(--color-ink-soft)] dark:text-white/60">{f.a}</p>
            )}
          </div>
        ))}
      </div>
    </StaticPage>
  )
}

export function Privacy() {
  return (
    <StaticPage eyebrow="Legal" title="Privacy policy">
      <p>
        This is placeholder policy text for the MediLearn Academy scaffold. Replace it with
        counsel-reviewed language covering what student data is collected, how course progress
        and assessment records are stored, and how long records are retained before deployment.
      </p>
    </StaticPage>
  )
}

export function Terms() {
  return (
    <StaticPage eyebrow="Legal" title="Terms of service">
      <p>
        This is placeholder terms text for the MediLearn Academy scaffold. Replace it with
        counsel-reviewed terms covering enrollment, certification, acceptable use of protected
        course material, and payment terms before deployment.
      </p>
    </StaticPage>
  )
}

export function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-5 text-center">
      <div>
        <div className="font-mono text-sm text-[var(--color-teal-500)]">404</div>
        <h1 className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
          Page not found
        </h1>
        <p className="mt-2 text-[var(--color-ink-soft)] dark:text-white/60">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 rounded-full bg-[var(--color-navy-800)] text-white font-semibold"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
