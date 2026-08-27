import { useCallback, useEffect, useState } from 'react'
import { apiGetEnrollment, apiApplyForCourse } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import type { Enrollment } from '../types/database'

export function useEnrollment(courseId: string | undefined) {
  const { user } = useAuth()
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!courseId || !user?.id) {
      setEnrollment(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await apiGetEnrollment(courseId, user.id)
      setEnrollment(data as Enrollment | null)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load enrollment.')
    } finally {
      setLoading(false)
    }
  }, [courseId, user?.id])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function apply() {
    if (!courseId || !user?.id) return { error: 'You must be logged in to apply.' }
    setSubmitting(true)
    try {
      const data = await apiApplyForCourse(courseId, user.id)
      setEnrollment(data as Enrollment)
      return { error: null }
    } catch (applyError) {
      return { error: applyError instanceof Error ? applyError.message : 'Application failed.' }
    } finally {
      setSubmitting(false)
    }
  }

  return { enrollment, loading, submitting, error, apply, refresh }
}
