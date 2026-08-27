import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { VitalRule } from '../components/VitalRule'

export function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: { pathname: string } } }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn({ email, password })
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    navigate(location.state?.from?.pathname ?? '/student/dashboard')
  }

  return (
    <div className="mx-auto max-w-md px-5 sm:px-8 py-20">
      <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-teal-500)]">
        Welcome back
      </span>
      <h1 className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
        Log in to MediLearn
      </h1>
      <VitalRule className="mt-6 max-w-[160px]" />

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--color-ink)] dark:text-white/80 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-[var(--color-ink)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-500)]"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-ink)] dark:text-white/80">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-medium text-[var(--color-teal-500)]">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-[var(--color-ink)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-500)]"
          />
        </div>

        {error && (
          <div className="text-sm text-[var(--color-vital-500)] bg-[var(--color-vital-100)] dark:bg-[var(--color-vital-500)]/10 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-[var(--color-navy-800)] text-white font-semibold hover:bg-[var(--color-navy-700)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Log in
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-[var(--color-ink-soft)] dark:text-white/60">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-[var(--color-teal-500)]">
          Create one
        </Link>
      </p>
    </div>
  )
}
