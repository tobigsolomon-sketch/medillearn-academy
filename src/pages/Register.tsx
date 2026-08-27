import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { VitalRule } from '../components/VitalRule'

export function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError(null)
    const { error } = await signUp({ email, password, fullName })
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-5 sm:px-8 py-24 text-center">
        <h1 className="font-display font-semibold text-2xl text-[var(--color-navy-900)] dark:text-white">
          Check your inbox
        </h1>
        <p className="mt-3 text-[var(--color-ink-soft)] dark:text-white/60">
          We sent a confirmation link to <strong>{email}</strong>. Verify your email, then log in
          to browse courses and apply.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 px-6 py-3 rounded-full bg-[var(--color-navy-800)] text-white font-semibold"
        >
          Go to login
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-5 sm:px-8 py-20">
      <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-teal-500)]">
        Join MediLearn
      </span>
      <h1 className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
        Create your account
      </h1>
      <VitalRule className="mt-6 max-w-[160px]" />

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[var(--color-ink)] dark:text-white/80 mb-1.5">
            Full name
          </label>
          <input
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-[var(--color-ink)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-500)]"
          />
        </div>
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
          <label htmlFor="password" className="block text-sm font-medium text-[var(--color-ink)] dark:text-white/80 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-[var(--color-ink)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-500)]"
          />
          <p className="mt-1.5 text-xs text-[var(--color-ink-soft)] dark:text-white/40">At least 8 characters.</p>
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
          Create account
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-[var(--color-ink-soft)] dark:text-white/60">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[var(--color-teal-500)]">
          Log in
        </Link>
      </p>
    </div>
  )
}
