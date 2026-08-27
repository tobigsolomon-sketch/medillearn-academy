import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import type { BeforeInstallPromptEvent } from '../lib/pwa'

export function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('medilearn-install-dismissed') === '1')

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault()
      setPromptEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!promptEvent || dismissed) return null

  async function handleInstall() {
    if (!promptEvent) return
    await promptEvent.prompt()
    await promptEvent.userChoice
    setPromptEvent(null)
  }

  function handleDismiss() {
    setDismissed(true)
    sessionStorage.setItem('medilearn-install-dismissed', '1')
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 rounded-2xl bg-[var(--color-navy-900)] text-white shadow-2xl p-4 flex items-start gap-3">
      <div className="h-9 w-9 shrink-0 rounded-xl bg-[var(--color-teal-500)]/20 grid place-items-center text-[var(--color-teal-400)]">
        <Download size={17} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">Install MediLearn Academy</p>
        <p className="text-xs text-white/60 mt-0.5">Add it to your home screen for one-tap access.</p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleInstall}
            className="text-xs font-semibold px-3.5 py-2 rounded-full bg-[var(--color-teal-500)] text-white"
          >
            Install
          </button>
          <button onClick={handleDismiss} className="text-xs font-medium px-3.5 py-2 rounded-full text-white/60 hover:text-white">
            Not now
          </button>
        </div>
      </div>
      <button onClick={handleDismiss} aria-label="Dismiss" className="text-white/40 hover:text-white">
        <X size={16} />
      </button>
    </div>
  )
}
