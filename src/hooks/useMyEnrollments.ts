import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import type { Course, Enrollment } from '../types/database'

export interface MyEnrollment extends Enrollment {
  course: Course
}

export function useMyEnrollments() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<MyEnrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setEnrollments([])
      setLoading(false)
      return
    }
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, course:courses(*)')
        .eq('student_id', user!.id)
        .order('applied_at', { ascending: false })
      if (!cancelled) {
        if (!error && data) setEnrollments(data as unknown as MyEnrollment[])
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user])

  return { enrollments, loading }
}
