import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: string[] }) {
  const { user, loading, profile } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--color-teal-500)] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0 && !roles.includes(profile?.role || 'student')) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
