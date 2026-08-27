import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Moon, Sun, LayoutDashboard, LogOut } from 'lucide-react'
import { Logo } from './Logo'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../hooks/useTheme'

const links = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/about', label: 'About' },
  { to: '/verify-certificate', label: 'Verify Certificate' },
]

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard' },
  { to: '/resources', label: 'Resources' },
]

const adminLinks = [
  { to: '/admin', label: 'Admin' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 dark:border-white/10 bg-[var(--color-paper)]/85 dark:bg-[var(--color-navy-950)]/85 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--color-teal-500)]'
                    : 'text-[var(--color-ink-soft)] hover:text-[var(--color-navy-900)] dark:hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {profile?.role === 'admin' &&
            adminLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[var(--color-teal-500)]'
                      : 'text-[var(--color-ink-soft)] hover:text-[var(--color-navy-900)] dark:hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          {profile?.role === 'student' &&
            studentLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[var(--color-teal-500)]'
                      : 'text-[var(--color-ink-soft)] hover:text-[var(--color-navy-900)] dark:hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="h-9 w-9 grid place-items-center rounded-full text-[var(--color-ink-soft)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {user ? (
            <>
              <Link
                to="/student/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-navy-900)] dark:text-white hover:text-[var(--color-teal-500)]"
              >
                <LayoutDashboard size={16} />
                {profile?.full_name?.split(' ')[0] ?? 'Dashboard'}
              </Link>
              <button
                onClick={handleSignOut}
                className="h-9 w-9 grid place-items-center rounded-full text-[var(--color-ink-soft)] hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[var(--color-navy-900)] dark:text-white hover:text-[var(--color-teal-500)]"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-[var(--color-navy-800)] text-white hover:bg-[var(--color-navy-700)] transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden h-9 w-9 grid place-items-center text-[var(--color-navy-900)] dark:text-white"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-black/5 dark:border-white/10 bg-[var(--color-paper)] dark:bg-[var(--color-navy-950)] px-5 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-medium text-[var(--color-ink-soft)] dark:text-white/80"
            >
              {l.label}
            </NavLink>
          ))}
          {profile?.role === 'admin' &&
            adminLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-[var(--color-ink-soft)] dark:text-white/80"
              >
                {l.label}
              </NavLink>
            ))}
          {profile?.role === 'student' &&
            studentLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-[var(--color-ink-soft)] dark:text-white/80"
              >
                {l.label}
              </NavLink>
            ))}
          <div className="h-px bg-black/5 dark:bg-white/10 my-2" />
          <button
            onClick={toggle}
            className="py-2.5 text-sm font-medium text-left text-[var(--color-ink-soft)] dark:text-white/80 flex items-center gap-2"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />} {dark ? 'Light mode' : 'Dark mode'}
          </button>
          {user ? (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-semibold text-[var(--color-navy-900)] dark:text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="py-2.5 text-sm font-semibold text-left text-[var(--color-vital-500)]"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="flex gap-3 pt-1">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 rounded-full text-sm font-semibold border border-black/10 dark:border-white/20 text-[var(--color-navy-900)] dark:text-white"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 rounded-full text-sm font-semibold bg-[var(--color-navy-800)] text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
