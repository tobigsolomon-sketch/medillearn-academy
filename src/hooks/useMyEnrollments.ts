import { useEffect, useState } from 'react'
import { apiGetMe } from '../lib/api'
import type { Course, Enrollment } from '../types/database'

export interface MyEnrollment extends Enrollment {
  course: Course
}

export function useMyEnrollments() {
  const [enrollments, setEnrollments] = useState<MyEnrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const me = await apiGetMe()
        if (!me || !me.id) {
          setEnrollments([])
          return
        }

        const res = await fetch(`http://localhost:3001/api/enrollments/student/${encodeURIComponent(me.id)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (cancelled) return
        setEnrollments((data.data ?? []) as MyEnrollment[])
      } catch {
        if (!cancelled) setEnrollments([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { enrollments, loading }
}
