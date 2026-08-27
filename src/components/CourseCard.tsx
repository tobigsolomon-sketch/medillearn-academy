import { Link } from 'react-router-dom'
import { Clock, Layers, Star, User } from 'lucide-react'
import type { Course } from '../types/database'

const levelLabel: Record<Course['level'], string> = {
  foundation: 'Foundation',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[var(--color-navy-900)] border border-black/5 dark:border-white/10 hover:shadow-xl hover:shadow-[var(--color-navy-900)]/5 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="relative h-44 bg-gradient-to-br from-[var(--color-navy-800)] to-[var(--color-teal-500)] overflow-hidden">
        {course.cover_image_url && (
          <img
            src={course.cover_image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-40 group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <span className="absolute top-3 left-3 text-[11px] font-mono uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/90 text-[var(--color-navy-900)]">
          {levelLabel[course.level]}
        </span>
        {course.is_free ? (
          <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--color-teal-500)] text-white">
            Free
          </span>
        ) : null}
      </div>

      <div className="flex-1 flex flex-col p-5">
        <h3 className="font-display font-semibold text-lg text-[var(--color-navy-900)] dark:text-white leading-snug">
          {course.title}
        </h3>
        <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] dark:text-white/60 line-clamp-2">
          {course.tagline ?? course.description}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-[var(--color-ink-soft)] dark:text-white/50 font-mono">
          <span className="flex items-center gap-1">
            <Clock size={13} /> {course.duration_weeks}w
          </span>
          <span className="flex items-center gap-1">
            <Layers size={13} /> {course.module_count} modules
          </span>
          {course.rating ? (
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-[var(--color-gold-500)] text-[var(--color-gold-500)]" />
              {course.rating.toFixed(1)}
            </span>
          ) : null}
        </div>

        <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-[var(--color-ink-soft)] dark:text-white/60">
            <User size={13} /> {course.instructor_name}
          </span>
          <span className="text-sm font-semibold text-[var(--color-teal-500)] group-hover:translate-x-0.5 transition-transform">
            View course →
          </span>
        </div>
      </div>
    </Link>
  )
}
