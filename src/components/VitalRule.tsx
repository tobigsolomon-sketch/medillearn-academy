interface VitalRuleProps {
  className?: string
}

/**
 * The site's signature graphic device: an ECG-style trace that reads as
 * both "vital sign" (medicine) and "progress line" (learning). Used as a
 * section divider in place of a generic hairline rule.
 */
export function VitalRule({ className = '' }: VitalRuleProps) {
  return (
    <svg
      className={`vital-rule ${className}`}
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 20 H340 L365 20 L378 6 L392 34 L406 20 L420 20 L432 12 L444 20 H520 L545 20 L558 6 L572 34 L586 20 L600 20 L612 12 L624 20 H860 L885 20 L898 6 L912 34 L926 20 L940 20 L952 12 L964 20 H1200"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
