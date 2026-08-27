import { Link } from 'react-router-dom'
import { AtSign, MessageCircle, Rss } from 'lucide-react'
import { Logo } from './Logo'

const columns = [
  {
    title: 'Platform',
    links: [
      { to: '/courses', label: 'Courses' },
      { to: '/about', label: 'About' },
      { to: '/verify-certificate', label: 'Certificate Verification' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/contact', label: 'Contact' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-[var(--color-navy-950)] text-white/70">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed max-w-xs text-white/50">
            Clinical training, built for the way clinicians actually learn — structured,
            assessed, and verifiable.
          </p>
          <div className="flex gap-3 mt-6">
            {[AtSign, MessageCircle, Rss].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Social link"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold text-white mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm hover:text-[var(--color-teal-400)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
          <span>© {new Date().getFullYear()} MediLearn Academy. All rights reserved.</span>
          <span className="font-mono">LEARN · PRACTICE · CERTIFY · SAVE LIVES</span>
        </div>
      </div>
    </footer>
  )
}
