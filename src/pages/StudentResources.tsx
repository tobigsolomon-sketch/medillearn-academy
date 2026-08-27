import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiGetCourses, apiGetCourseResources, apiDownloadResource } from '../lib/api'
import { Loader2, Download, File, Image, Video, ShieldOff } from 'lucide-react'
import type { Course } from '../types/database'

export function StudentResources() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [resources, setResources] = useState<Array<{ id: string; title: string; type: string; file_name: string; size_bytes: number; is_downloadable: number }>>([])
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    // load all courses for dropdown
    ;(async () => {
      const all = await apiGetCourses()
      setCourses(all)
    })()
  }, [])

  async function loadResources(courseId: string) {
    setSelectedCourse(courseId)
    setLoading(true)
    try {
      const data = await apiGetCourseResources(courseId)
      setResources(data)
    } catch {
      setResources([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload(filename: string, resourceId: string) {
    setDownloading(resourceId)
    try {
      const blob = await apiDownloadResource(filename, user?.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setDownloading(null)
    }
  }

  const iconForType = (type: string) => {
    if (type === 'video') return <Video size={18} />
    if (type === 'image') return <Image size={18} />
    return <File size={18} />
  }

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-14">
      <h1 className="font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">Course Resources</h1>
      <p className="mt-2 text-[var(--color-ink-soft)] dark:text-white/60">Download materials shared by your instructor.</p>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => loadResources(c.id)}
            className={`rounded-2xl border p-5 text-left transition-colors ${
              selectedCourse === c.id
                ? 'border-[var(--color-teal-500)] bg-[var(--color-teal-50)] dark:bg-[var(--color-teal-500)]/10'
                : 'border-black/5 dark:border-white/10 bg-white dark:bg-[var(--color-navy-900)]'
            }`}
          >
            <div className="font-display font-semibold text-[var(--color-navy-900)] dark:text-white">{c.title}</div>
            <div className="text-xs text-[var(--color-ink-soft)] dark:text-white/50 mt-1 capitalize">{c.level} · {c.duration_weeks} weeks</div>
          </button>
        ))}
      </div>

      {selectedCourse && (
        <div className="mt-10">
          <h2 className="font-display font-semibold text-xl text-[var(--color-navy-900)] dark:text-white mb-4">Resources</h2>
          {loading ? (
            <div className="py-12 grid place-items-center">
              <Loader2 className="animate-spin text-[var(--color-teal-500)]" />
            </div>
          ) : resources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/15 p-10 text-center text-[var(--color-ink-soft)] dark:text-white/50">
              No resources uploaded for this course yet.
            </div>
          ) : (
            <div className="space-y-3">
              {resources.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[var(--color-navy-900)] p-5">
                  <div className="flex items-center gap-3">
                    <div className="text-[var(--color-ink-soft)] dark:text-white/60">{iconForType(r.type)}</div>
                    <div>
                      <div className="font-medium text-[var(--color-navy-900)] dark:text-white">{r.title}</div>
                      <div className="text-xs text-[var(--color-ink-soft)] dark:text-white/50">{r.file_name} · {(r.size_bytes / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {r.is_downloadable ? (
                      <button
                        onClick={() => handleDownload(r.file_name, r.id)}
                        disabled={downloading === r.id}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-navy-800)] text-white text-sm font-semibold hover:bg-[var(--color-navy-700)] transition-colors disabled:opacity-60"
                      >
                        {downloading === r.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        Download
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-[var(--color-vital-100)] dark:bg-[var(--color-vital-500)]/10 text-[var(--color-vital-700)] dark:text-[var(--color-vital-400)]">
                        <ShieldOff size={14} /> Restricted
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
