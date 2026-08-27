import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { CourseCard } from '../components/CourseCard'
import { useCourses } from '../hooks/useCourses'
import type { CourseLevel } from '../types/database'

const levels: { value: CourseLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All levels' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export function Courses() {
  const { courses, loading, error } = useCourses()
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<CourseLevel | 'all'>('all')

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesLevel = level === 'all' || c.level === level
      const matchesQuery =
        query.trim().length === 0 ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor_name.toLowerCase().includes(query.toLowerCase())
      return matchesLevel && matchesQuery
    })
  }, [courses, query, level])

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
      <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-teal-500)]">
        Catalog
      </span>
      <h1 className="mt-2 font-display font-semibold text-4xl text-[var(--color-navy-900)] dark:text-white">
        Course catalog
      </h1>
      <p className="mt-3 text-[var(--color-ink-soft)] dark:text-white/60 max-w-xl">
        Browse every published course. Apply directly from a course page — an administrator
        reviews and approves each application.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses or instructors..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm text-[var(--color-ink)] dark:text-white placeholder:text-[var(--color-ink-soft)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-500)]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {levels.map((l) => (
            <button
              key={l.value}
              onClick={() => setLevel(l.value)}
              className={`shrink-0 px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${
                level === l.value
                  ? 'bg-[var(--color-navy-800)] text-white border-[var(--color-navy-800)]'
                  : 'bg-white dark:bg-[var(--color-navy-900)] text-[var(--color-ink-soft)] dark:text-white/70 border-black/10 dark:border-white/15'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[var(--color-vital-500)]/30 bg-[var(--color-vital-100)] dark:bg-[var(--color-vital-500)]/10 p-6 text-sm text-[var(--color-vital-500)]">
            Couldn't load courses: {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/15 p-12 text-center text-[var(--color-ink-soft)] dark:text-white/50">
            No courses match your search.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
