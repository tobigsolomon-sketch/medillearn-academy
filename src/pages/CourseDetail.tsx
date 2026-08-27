import { Link, useParams } from 'react-router-dom'
import {
  Clock,
  Layers,
  Star,
  User,
  CheckCircle2,
  Circle,
  Loader2,
  ShieldCheck,
  Award,
} from 'lucide-react'
import { useCourse } from '../hooks/useCourses'
import { useEnrollment } from '../hooks/useEnrollment'
import { useAuth } from '../contexts/AuthContext'

const levelLabel: Record<string, string> = {
  foundation: 'Foundation',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export function CourseDetail() {
  const { slug } = useParams()
  const { course, loading } = useCourse(slug)
  const { user } = useAuth()
  const { enrollment, loading: enrollmentLoading, submitting, apply, error } = useEnrollment(course?.id)

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="animate-spin text-[var(--color-teal-500)]" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-24 text-center">
        <h1 className="font-display font-semibold text-2xl text-[var(--color-navy-900)] dark:text-white">
          Course not found
        </h1>
        <p className="mt-2 text-[var(--color-ink-soft)] dark:text-white/60">
          It may have been unpublished or the link is incorrect.
        </p>
        <Link to="/courses" className="mt-6 inline-block text-[var(--color-teal-500)] font-semibold">
          ← Back to catalog
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="relative bg-gradient-to-br from-[var(--color-navy-900)] to-[var(--color-navy-700)] text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid lg:grid-cols-[1fr_360px] gap-12">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wide text-white/60">
              <span className="px-2.5 py-1 rounded-full bg-white/10">{levelLabel[course.level]}</span>
              {course.is_free && (
                <span className="px-2.5 py-1 rounded-full bg-[var(--color-teal-500)] text-white">Free</span>
              )}
            </div>
            <h1 className="mt-4 font-display font-semibold text-3xl sm:text-4xl leading-tight">
              {course.title}
            </h1>
            {course.tagline && <p className="mt-3 text-white/70 max-w-xl">{course.tagline}</p>}

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/70 font-mono">
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {course.duration_weeks} weeks
              </span>
              <span className="flex items-center gap-1.5">
                <Layers size={14} /> {course.module_count} modules
              </span>
              <span className="flex items-center gap-1.5">
                <User size={14} /> {course.instructor_name}
              </span>
              {course.rating && (
                <span className="flex items-center gap-1.5">
                  <Star size={14} className="fill-[var(--color-gold-500)] text-[var(--color-gold-500)]" />
                  {course.rating.toFixed(1)} · {course.enrollment_count} enrolled
                </span>
              )}
            </div>
          </div>

          {/* Enrollment card */}
          <div className="bg-white text-[var(--color-ink)] rounded-2xl p-6 h-fit shadow-xl">
            {!user ? (
              <>
                <p className="text-sm text-[var(--color-ink-soft)]">
                  Log in or create an account to apply for this course.
                </p>
                <Link
                  to="/login"
                  className="mt-4 block text-center py-3 rounded-full bg-[var(--color-navy-800)] text-white font-semibold hover:bg-[var(--color-navy-700)] transition-colors"
                >
                  Log in to apply
                </Link>
                <Link
                  to="/register"
                  className="mt-2 block text-center py-3 rounded-full border border-black/10 font-semibold text-[var(--color-navy-900)] hover:bg-black/5 transition-colors"
                >
                  Create an account
                </Link>
              </>
            ) : enrollmentLoading ? (
              <div className="py-6 grid place-items-center">
                <Loader2 className="animate-spin text-[var(--color-teal-500)]" size={20} />
              </div>
            ) : enrollment?.status === 'approved' ? (
              <>
                <div className="flex items-center gap-2 text-[var(--color-teal-600)] font-semibold text-sm">
                  <CheckCircle2 size={18} /> Enrollment approved
                </div>
                <Link
                  to="/student/dashboard"
                  className="mt-4 block text-center py-3 rounded-full bg-[var(--color-navy-800)] text-white font-semibold hover:bg-[var(--color-navy-700)] transition-colors"
                >
                  Go to dashboard
                </Link>
              </>
            ) : enrollment?.status === 'pending' ? (
              <div className="flex items-center gap-2 text-[var(--color-gold-500)] font-semibold text-sm">
                <Circle size={18} /> Application pending approval
              </div>
            ) : enrollment?.status === 'rejected' ? (
              <div className="flex items-center gap-2 text-[var(--color-vital-500)] font-semibold text-sm">
                Application not approved. Contact support for details.
              </div>
            ) : enrollment?.status === 'suspended' ? (
              <div className="flex items-center gap-2 text-[var(--color-vital-500)] font-semibold text-sm">
                Enrollment suspended. Contact an administrator.
              </div>
            ) : (
              <>
                <p className="text-sm text-[var(--color-ink-soft)]">
                  Apply now — an administrator reviews every application before you get access to
                  course content.
                </p>
                <button
                  onClick={apply}
                  disabled={submitting}
                  className="mt-4 w-full py-3 rounded-full bg-[var(--color-navy-800)] text-white font-semibold hover:bg-[var(--color-navy-700)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Apply for course
                </button>
                {error && <p className="mt-2 text-xs text-[var(--color-vital-500)]">{error}</p>}
              </>
            )}

            <div className="mt-5 pt-5 border-t border-black/5 space-y-2.5 text-xs text-[var(--color-ink-soft)]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[var(--color-teal-500)]" /> Protected, permissioned
                content
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-[var(--color-teal-500)]" /> Verifiable certificate on
                completion
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid lg:grid-cols-[1fr_360px] gap-12">
        <div className="space-y-10">
          <section>
            <h2 className="font-display font-semibold text-xl text-[var(--color-navy-900)] dark:text-white">
              About this course
            </h2>
            <p className="mt-3 text-[var(--color-ink-soft)] dark:text-white/60 leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </section>

          {course.objectives && course.objectives.length > 0 && (
            <section>
              <h2 className="font-display font-semibold text-xl text-[var(--color-navy-900)] dark:text-white">
                Learning objectives
              </h2>
              <ul className="mt-3 space-y-2">
                {course.objectives.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-sm text-[var(--color-ink-soft)] dark:text-white/60">
                    <CheckCircle2 size={16} className="text-[var(--color-teal-500)] shrink-0 mt-0.5" />
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.requirements && course.requirements.length > 0 && (
            <section>
              <h2 className="font-display font-semibold text-xl text-[var(--color-navy-900)] dark:text-white">
                Requirements
              </h2>
              <ul className="mt-3 space-y-2">
                {course.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-[var(--color-ink-soft)] dark:text-white/60">
                    <Circle size={7} className="text-[var(--color-teal-500)] shrink-0 mt-1.5 fill-current" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-black/5 dark:border-white/10 p-6 bg-white dark:bg-[var(--color-navy-900)]">
          <h3 className="font-display font-semibold text-[var(--color-navy-900)] dark:text-white">
            Course facts
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)] dark:text-white/50">Level</dt>
              <dd className="font-medium text-[var(--color-navy-900)] dark:text-white">
                {levelLabel[course.level]}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)] dark:text-white/50">Duration</dt>
              <dd className="font-medium text-[var(--color-navy-900)] dark:text-white">
                {course.duration_weeks} weeks
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)] dark:text-white/50">Modules</dt>
              <dd className="font-medium text-[var(--color-navy-900)] dark:text-white">
                {course.module_count}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)] dark:text-white/50">Instructor</dt>
              <dd className="font-medium text-[var(--color-navy-900)] dark:text-white">
                {course.instructor_name}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
