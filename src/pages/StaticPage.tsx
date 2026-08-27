import type { ReactNode } from 'react'
import { VitalRule } from '../components/VitalRule'

export function StaticPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-20">
      <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-teal-500)]">
        {eyebrow}
      </span>
      <h1 className="mt-2 font-display font-semibold text-4xl text-[var(--color-navy-900)] dark:text-white">
        {title}
      </h1>
      <VitalRule className="mt-6 max-w-[160px]" />
      <div className="mt-8 prose-sm space-y-4 text-[var(--color-ink-soft)] dark:text-white/60 leading-relaxed">
        {children}
      </div>
    </div>
  )
}
