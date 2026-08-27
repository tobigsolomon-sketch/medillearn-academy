import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Course } from '../types/database'

export function useCourses(opts: { limit?: number } = {}) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      let query = supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      if (opts.limit) query = query.limit(opts.limit)

      try {
        const { data, error } = await query
        if (cancelled) return
        if (error) setError(error.message)
        else setCourses((data ?? []) as Course[])
      } catch (loadError) {
        if (cancelled) return
        setError(
          loadError instanceof TypeError
            ? 'Unable to reach Supabase. Check the Vercel environment variables and Supabase project URL.'
            : loadError instanceof Error
              ? loadError.message
              : 'Courses could not be loaded.',
        )
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
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single()
        if (cancelled) return
        if (error) setError(error.message)
        else setCourse(data as Course)
      } catch (loadError) {
        if (cancelled) return
        setError(
          loadError instanceof TypeError
            ? 'Unable to reach Supabase. Check the Vercel environment variables and Supabase project URL.'
            : loadError instanceof Error
              ? loadError.message
              : 'Course could not be loaded.',
        )
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
