import { Link } from 'react-router-dom'
import { Loader2, ArrowRight, Clock, CheckCircle2, XCircle, PauseCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useMyEnrollments } from '../hooks/useMyEnrollments'
import type { EnrollmentStatus } from '../types/database'

const statusMeta: Record<EnrollmentStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: 'Pending approval', icon: Clock, className: 'text-[var(--color-gold-500)] bg-[var(--color-gold-500)]/10' },
  approved: { label: 'Approved', icon: CheckCircle2, className: 'text-[var(--color-teal-500)] bg-[var(--color-teal-100)] dark:bg-[var(--color-teal-500)]/10' },
  rejected: { label: 'Not approved', icon: XCircle, className: 'text-[var(--color-vital-500)] bg-[var(--color-vital-100)] dark:bg-[var(--color-vital-500)]/10' },
  suspended: { label: 'Suspended', icon: PauseCircle, className: 'text-[var(--color-vital-500)] bg-[var(--color-vital-100)] dark:bg-[var(--color-vital-500)]/10' },
}

export function StudentDashboard() {
  const { profile } = useAuth()
  const { enrollments, loading } = useMyEnrollments()

  const approvedCount = enrollments.filter((e) => e.status === 'approved').length
  const pendingCount = enrollments.filter((e) => e.status === 'pending').length

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
      <h1 className="font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
        Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
      </h1>
      <p className="mt-2 text-[var(--color-ink-soft)] dark:text-white/60">
        Here's where things stand with your applications and courses.
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[var(--color-navy-900)] p-6">
          <div className="text-xs font-mono uppercase tracking-wide text-[var(--color-ink-soft)] dark:text-white/50">
            Enrolled courses
          </div>
          <div className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
            {approvedCount}
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[var(--color-navy-900)] p-6">
          <div className="text-xs font-mono uppercase tracking-wide text-[var(--color-ink-soft)] dark:text-white/50">
            Pending applications
          </div>
          <div className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
            {pendingCount}
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[var(--color-navy-900)] p-6">
          <div className="text-xs font-mono uppercase tracking-wide text-[var(--color-ink-soft)] dark:text-white/50">
            Certificates
          </div>
          <div className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
            0
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-[var(--color-navy-900)] dark:text-white">
          Your applications
        </h2>
        <Link to="/courses" className="text-sm font-semibold text-[var(--color-teal-500)] flex items-center gap-1">
          Browse more courses <ArrowRight size={14} />
        </Link>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="py-12 grid place-items-center">
            <Loader2 className="animate-spin text-[var(--color-teal-500)]" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/15 p-10 text-center">
            <p className="text-[var(--color-ink-soft)] dark:text-white/60">
              You haven't applied to any courses yet.
            </p>
            <Link
              to="/courses"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-teal-500)]"
            >
              Explore the catalog <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enrollments.map((e) => {
              const meta = statusMeta[e.status]
              const Icon = meta.icon
              return (
                <div
                  key={e.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[var(--color-navy-900)] p-5"
                >
                  <div>
                    <Link
                      to={`/courses/${e.course.slug}`}
                      className="font-display font-semibold text-[var(--color-navy-900)] dark:text-white hover:text-[var(--color-teal-500)]"
                    >
                      {e.course.title}
                    </Link>
                    <div className="text-xs text-[var(--color-ink-soft)] dark:text-white/50 mt-1">
                      Applied {new Date(e.applied_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${meta.className}`}>
                      <Icon size={13} /> {meta.label}
                    </span>
                    {e.status === 'approved' && (
                      <Link
                        to={`/courses/${e.course.slug}`}
                        className="text-sm font-semibold text-[var(--color-teal-500)] flex items-center gap-1"
                      >
                        Continue <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
