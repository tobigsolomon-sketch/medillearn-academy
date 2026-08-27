import { useEffect, useState } from 'react'
import { apiGetCourses, apiGetCourse } from '../lib/api'
import type { Course } from '../types/database'

function getLoadErrorMessage(loadError: unknown, fallback: string) {
  if (loadError instanceof TypeError) {
    return 'Unable to reach the server. Make sure the backend is running on http://localhost:3001.'
  }
  if (loadError instanceof Error) return loadError.message
  return fallback
}

export function useCourses(opts: { limit?: number } = {}) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const all = await apiGetCourses()
        if (cancelled) return
        const data = all.slice(0, opts.limit ?? all.length)
        setCourses(data as Course[])
      } catch (loadError) {
        if (cancelled) return
        setError(getLoadErrorMessage(loadError, 'Courses could not be loaded.'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [opts.limit])

  return { courses, loading, error }
}

export function useCourse(slug: string | undefined) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const data = await apiGetCourse(slug)
        if (cancelled) return
        setCourse(data as Course | null)
        if (!data) setError('Course not found.')
      } catch (loadError) {
        if (cancelled) return
        setError(getLoadErrorMessage(loadError, 'Course could not be loaded.'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  return { course, loading, error }
}
