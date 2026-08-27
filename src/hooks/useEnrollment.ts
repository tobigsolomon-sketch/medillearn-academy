import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import type { Enrollment } from '../types/database'

export function useEnrollment(courseId: string | undefined) {
  const { user } = useAuth()
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!courseId || !user) {
      setEnrollment(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('course_id', courseId)
      .eq('student_id', user.id)
      .maybeSingle()
    if (error) setError(error.message)
    else setEnrollment(data as Enrollment | null)
    setLoading(false)
  }, [courseId, user])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function apply() {
    if (!courseId || !user) return { error: 'You must be logged in to apply.' }
    setSubmitting(true)
    const { data, error } = await supabase
      .from('enrollments')
      .insert({ course_id: courseId, student_id: user.id, status: 'pending' })
      .select()
      .single()
    setSubmitting(false)
    if (error) return { error: error.message }
    setEnrollment(data as Enrollment)
    return { error: null }
  }

  return { enrollment, loading, submitting, error, apply, refresh }
}
