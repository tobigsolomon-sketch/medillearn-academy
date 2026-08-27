import { Link } from 'react-router-dom'

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <rect width="30" height="30" rx="8" className="fill-[var(--color-navy-800)] dark:fill-[var(--color-teal-400)]" />
        <path
          d="M6 15H10.5L12.5 9L16 21L18.5 15H24"
          stroke={dark ? '#0b1e33' : 'white'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="dark:stroke-[var(--color-navy-950)]"
        />
      </svg>
      <span className="font-display font-semibold text-lg tracking-tight text-[var(--color-navy-900)] dark:text-white">
        MediLearn <span className="text-[var(--color-teal-500)]">Academy</span>
      </span>
    </Link>
  )
}
