import { useState } from 'react'
import { CheckCircle2, Loader2, Search, XCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { VitalRule } from '../components/VitalRule'

interface CertificateResult {
  certificate_id: string
  student_name: string
  course_title: string
  issued_at: string
}

export function VerifyCertificate() {
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CertificateResult | null | 'not_found'>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id.trim()) return
    setLoading(true)
    setResult(null)
    // Certificates table/RPC ships with a later phase of the build (see
    // section 17 of the product spec); this calls a public RPC so lookups
    // never require exposing student records directly.
    const { data, error } = await supabase
      .rpc('verify_certificate', { cert_id: id.trim() })
      .maybeSingle()
    setLoading(false)
    if (error || !data) {
      setResult('not_found')
      return
    }
    setResult(data as CertificateResult)
  }

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-20">
      <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-teal-500)]">
        Public verification
      </span>
      <h1 className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
        Verify a certificate
      </h1>
      <p className="mt-3 text-[var(--color-ink-soft)] dark:text-white/60">
        Enter the certificate ID printed below the QR code to confirm it was issued by MediLearn
        Academy.
      </p>
      <VitalRule className="mt-6 max-w-[160px]" />

      <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="e.g. MLA-2026-04213"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] font-mono text-sm text-[var(--color-ink)] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal-500)]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 rounded-xl bg-[var(--color-navy-800)] text-white font-semibold hover:bg-[var(--color-navy-700)] transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify'}
        </button>
      </form>

      {result === 'not_found' && (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[var(--color-vital-500)]/30 bg-[var(--color-vital-100)] dark:bg-[var(--color-vital-500)]/10 p-5">
          <XCircle className="text-[var(--color-vital-500)] shrink-0" size={20} />
          <div>
            <div className="font-semibold text-[var(--color-vital-500)]">Certificate not found</div>
            <p className="text-sm text-[var(--color-ink-soft)] dark:text-white/60 mt-1">
              Double-check the ID, or contact the certificate holder to confirm it.
            </p>
          </div>
        </div>
      )}

      {result && result !== 'not_found' && (
        <div className="mt-8 rounded-2xl border border-[var(--color-teal-500)]/30 bg-[var(--color-teal-100)] dark:bg-[var(--color-teal-500)]/10 p-6">
          <div className="flex items-center gap-2 text-[var(--color-teal-600)] dark:text-[var(--color-teal-400)] font-semibold">
            <CheckCircle2 size={20} /> Certificate verified
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)] dark:text-white/50">Student</dt>
              <dd className="font-medium text-[var(--color-navy-900)] dark:text-white">{result.student_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)] dark:text-white/50">Course</dt>
              <dd className="font-medium text-[var(--color-navy-900)] dark:text-white">{result.course_title}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)] dark:text-white/50">Issued</dt>
              <dd className="font-medium text-[var(--color-navy-900)] dark:text-white">
                {new Date(result.issued_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}
