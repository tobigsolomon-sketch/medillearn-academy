import { useEffect, useState } from 'react'
import {
  Loader2,
  ShieldCheck,
  Users,
  BookOpen,
  FolderOpen,
  Download,
  Upload,
  Trash2,
  Shield,
  ShieldOff,
  Search,
} from 'lucide-react'
import {
  apiGetAdminEnrollments,
  apiUpdateEnrollmentStatus,
  apiGetAdminResources,
  apiUploadResource,
  apiDeleteResource,
  apiGetAdminUsers,
  apiUpdateUserRole,
  apiGetPermissions,
  apiSetPermission,
  apiGetCourses,
} from '../lib/api'

type EnrollmentRow = {
  id: string
  course_title: string
  course_slug: string
  student_name: string
  student_email: string
  status: string
  applied_at: string
  decided_at?: string | null
}

type ResourceRow = {
  id: string
  course_id: string
  course_title?: string
  title: string
  description: string
  type: string
  file_path: string
  file_name: string
  mime_type: string
  size_bytes: number
  is_downloadable: number
  created_at: string
}

type UserRow = {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
}

type PermissionRow = {
  id: string
  resource_id: string
  user_id: string
  resource_title: string
  user_name: string
  allowed: number
  created_at: string
}

type Tab = 'enrollments' | 'resources' | 'users' | 'permissions'

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('enrollments')
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([])
  const [resources, setResources] = useState<ResourceRow[]>([])
  const [users, setUsers] = useState<UserRow[]>([])
  const [permissions, setPermissions] = useState<PermissionRow[]>([])
  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const [uploadCourseId, setUploadCourseId] = useState('')
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadType, setUploadType] = useState<'file' | 'video' | 'image'>('file')
  const [uploadDownloadable, setUploadDownloadable] = useState(true)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      const [enrollmentsData, resourcesData, usersData, permissionsData, coursesData] = await Promise.all([
        apiGetAdminEnrollments(),
        apiGetAdminResources(),
        apiGetAdminUsers(),
        apiGetPermissions(),
        apiGetCourses(),
      ])
      setEnrollments(enrollmentsData)
      setResources(resourcesData)
      setUsers(usersData)
      setPermissions(permissionsData)
      setCourses(coursesData.map((c) => ({ id: c.id, title: c.title })))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  async function handleUpdateStatus(id: string, status: string) {
    setUpdating(id)
    try {
      await apiUpdateEnrollmentStatus(id, status)
      setEnrollments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status, decided_at: new Date().toISOString() } : e))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update enrollment.')
    } finally {
      setUpdating(null)
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!uploadFile || !uploadCourseId || !uploadTitle) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('courseId', uploadCourseId)
      formData.append('title', uploadTitle)
      formData.append('description', uploadDescription)
      formData.append('type', uploadType)
      formData.append('isDownloadable', String(uploadDownloadable))
      const res = await apiUploadResource(formData)
      setResources((prev) => [res.data as ResourceRow, ...prev])
      setUploadTitle('')
      setUploadDescription('')
      setUploadFile(null)
      setUploadType('file')
      setUploadDownloadable(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteResource(id: string) {
    try {
      await apiDeleteResource(id)
      setResources((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource.')
    }
  }

  async function handleUpdateUserRole(id: string, role: string) {
    try {
      await apiUpdateUserRole(id, role)
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role.')
    }
  }

  async function handleSetPermission(resourceId: string, userId: string, allowed: boolean) {
    try {
      await apiSetPermission(resourceId, userId, allowed)
      setPermissions((prev) =>
        prev.map((p) =>
          p.resource_id === resourceId && p.user_id === userId ? { ...p, allowed: allowed ? 1 : 0 } : p
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update permission.')
    }
  }

  const enrollmentCounts = {
    pending: enrollments.filter((e) => e.status === 'pending').length,
    approved: enrollments.filter((e) => e.status === 'approved').length,
    rejected: enrollments.filter((e) => e.status === 'rejected').length,
    suspended: enrollments.filter((e) => e.status === 'suspended').length,
  }

  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.student_name.toLowerCase().includes(search.toLowerCase()) ||
      e.course_title.toLowerCase().includes(search.toLowerCase())
  )
  const filteredResources = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.course_title?.toLowerCase().includes(search.toLowerCase())
  )
  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-[var(--color-teal-500)]" size={28} />
        <div>
          <h1 className="font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">
            Admin dashboard
          </h1>
          <p className="text-sm text-[var(--color-ink-soft)] dark:text-white/60">
            Manage courses, resources, users, and download permissions.
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto">
        {[
          { key: 'enrollments', label: 'Enrollments', icon: BookOpen },
          { key: 'resources', label: 'Resources', icon: FolderOpen },
          { key: 'users', label: 'Users', icon: Users },
          { key: 'permissions', label: 'Permissions', icon: Shield },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors flex items-center gap-2 ${
              tab === t.key
                ? 'bg-[var(--color-navy-800)] text-white border-[var(--color-navy-800)]'
                : 'bg-white dark:bg-[var(--color-navy-900)] text-[var(--color-ink-soft)] dark:text-white/70 border-black/10 dark:border-white/15'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="py-12 grid place-items-center">
            <Loader2 className="animate-spin text-[var(--color-teal-500)]" size={32} />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[var(--color-vital-500)]/30 bg-[var(--color-vital-100)] dark:bg-[var(--color-vital-500)]/10 p-6 text-sm text-[var(--color-vital-500)]">
            {error}
            <button onClick={loadAll} className="ml-4 underline">Retry</button>
          </div>
        ) : (
          <>
            {tab === 'enrollments' && (
              <div>
                <div className="grid sm:grid-cols-4 gap-4 mb-6">
                  {Object.entries(enrollmentCounts).map(([status, count]) => (
                    <div key={status} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[var(--color-navy-900)] p-5">
                      <div className="text-xs font-mono uppercase tracking-wide text-[var(--color-ink-soft)] dark:text-white/50 capitalize">{status}</div>
                      <div className="mt-2 font-display font-semibold text-3xl text-[var(--color-navy-900)] dark:text-white">{count}</div>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search students or courses..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-black/5 dark:border-white/10">
                  <table className="min-w-full text-sm">
                    <thead className="bg-black/5 dark:bg-white/5 text-left">
                      <tr>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Student</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Course</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Status</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Applied</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/10">
                      {filteredEnrollments.map((e) => (
                        <tr key={e.id} className="bg-white dark:bg-[var(--color-navy-900)]">
                          <td className="px-5 py-4">
                            <div className="font-medium text-[var(--color-navy-900)] dark:text-white">{e.student_name}</div>
                            <div className="text-xs text-[var(--color-ink-soft)] dark:text-white/50">{e.student_email}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-medium text-[var(--color-navy-900)] dark:text-white">{e.course_title}</div>
                          </td>
                          <td className="px-5 py-4 capitalize">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-teal-100)] dark:bg-[var(--color-teal-500)]/10 text-[var(--color-teal-700)] dark:text-[var(--color-teal-400)]">
                              {e.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[var(--color-ink-soft)] dark:text-white/60">
                            {new Date(e.applied_at).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateStatus(e.id, 'approved')} disabled={updating === e.id} className="px-3 py-1.5 rounded-lg bg-[var(--color-teal-500)] text-white text-xs font-semibold disabled:opacity-50">Approve</button>
                              <button onClick={() => handleUpdateStatus(e.id, 'rejected')} disabled={updating === e.id} className="px-3 py-1.5 rounded-lg bg-[var(--color-vital-500)] text-white text-xs font-semibold disabled:opacity-50">Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredEnrollments.length === 0 && (
                    <div className="p-8 text-center text-[var(--color-ink-soft)] dark:text-white/50">No enrollments found.</div>
                  )}
                </div>
              </div>
            )}

            {tab === 'resources' && (
              <div className="space-y-6">
                <form onSubmit={handleUpload} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[var(--color-navy-900)] p-6 space-y-4">
                  <h3 className="font-display font-semibold text-lg text-[var(--color-navy-900)] dark:text-white flex items-center gap-2"><Upload size={18} /> Upload Resource</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-ink-soft)] dark:text-white/60 mb-1">Course</label>
                      <select value={uploadCourseId} onChange={(e) => setUploadCourseId(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm">
                        <option value="">Select course</option>
                        {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-ink-soft)] dark:text-white/60 mb-1">Title</label>
                      <input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} required className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-ink-soft)] dark:text-white/60 mb-1">Type</label>
                      <select value={uploadType} onChange={(e) => setUploadType(e.target.value as 'file' | 'video' | 'image')} className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm">
                        <option value="file">File</option>
                        <option value="video">Video</option>
                        <option value="image">Image</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-ink-soft)] dark:text-white/60 mb-1">File</label>
                      <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} required className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-ink-soft)] dark:text-white/60 mb-1">Description</label>
                    <textarea value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm" />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-[var(--color-ink-soft)] dark:text-white/70">
                    <input type="checkbox" checked={uploadDownloadable} onChange={(e) => setUploadDownloadable(e.target.checked)} />
                    Allow downloads
                  </label>
                  <button type="submit" disabled={uploading} className="px-4 py-2 rounded-full bg-[var(--color-navy-800)] text-white font-semibold hover:bg-[var(--color-navy-700)] transition-colors disabled:opacity-60">
                    {uploading ? <Loader2 size={16} className="animate-spin inline mr-2" /> : <Upload size={16} className="inline mr-2" />}
                    Upload
                  </button>
                </form>

                <div className="mb-4">
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm" />
                  </div>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-black/5 dark:border-white/10">
                  <table className="min-w-full text-sm">
                    <thead className="bg-black/5 dark:bg-white/5 text-left">
                      <tr>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Title</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Course</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Type</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Download</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/10">
                      {filteredResources.map((r) => (
                        <tr key={r.id} className="bg-white dark:bg-[var(--color-navy-900)]">
                          <td className="px-5 py-4">
                            <div className="font-medium text-[var(--color-navy-900)] dark:text-white">{r.title}</div>
                            <div className="text-xs text-[var(--color-ink-soft)] dark:text-white/50">{r.file_name}</div>
                          </td>
                          <td className="px-5 py-4 text-[var(--color-ink-soft)] dark:text-white/60">{r.course_title}</td>
                          <td className="px-5 py-4 capitalize text-[var(--color-ink-soft)] dark:text-white/60">{r.type}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${r.is_downloadable ? 'bg-[var(--color-teal-100)] dark:bg-[var(--color-teal-500)]/10 text-[var(--color-teal-700)] dark:text-[var(--color-teal-400)]' : 'bg-[var(--color-vital-100)] dark:bg-[var(--color-vital-500)]/10 text-[var(--color-vital-700)] dark:text-[var(--color-vital-400)]'}`}>
                              {r.is_downloadable ? <Download size={13} /> : <ShieldOff size={13} />}
                              {r.is_downloadable ? 'Allowed' : 'Blocked'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button onClick={() => handleDeleteResource(r.id)} className="text-[var(--color-vital-500)] hover:text-[var(--color-vital-700)]">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredResources.length === 0 && (
                    <div className="p-8 text-center text-[var(--color-ink-soft)] dark:text-white/50">No resources uploaded yet.</div>
                  )}
                </div>
              </div>
            )}

            {tab === 'users' && (
              <div>
                <div className="mb-4">
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm" />
                  </div>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-black/5 dark:border-white/10">
                  <table className="min-w-full text-sm">
                    <thead className="bg-black/5 dark:bg-white/5 text-left">
                      <tr>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Name</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Email</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Role</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Joined</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/10">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="bg-white dark:bg-[var(--color-navy-900)]">
                          <td className="px-5 py-4 font-medium text-[var(--color-navy-900)] dark:text-white">{u.full_name}</td>
                          <td className="px-5 py-4 text-[var(--color-ink-soft)] dark:text-white/60">{u.email}</td>
                          <td className="px-5 py-4">
                            <select value={u.role} onChange={(e) => handleUpdateUserRole(u.id, e.target.value)} className="px-2 py-1 rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-xs">
                              <option value="student">Student</option>
                              <option value="instructor">Instructor</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-5 py-4 text-[var(--color-ink-soft)] dark:text-white/60">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="px-5 py-4 text-[var(--color-ink-soft)] dark:text-white/50 text-xs">ID: {u.id.slice(0, 8)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-[var(--color-ink-soft)] dark:text-white/50">No users found.</div>
                  )}
                </div>
              </div>
            )}

            {tab === 'permissions' && (
              <div>
                <div className="mb-4">
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search permissions..." className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-[var(--color-navy-900)] text-sm" />
                  </div>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-black/5 dark:border-white/10">
                  <table className="min-w-full text-sm">
                    <thead className="bg-black/5 dark:bg-white/5 text-left">
                      <tr>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Resource</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">User</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Allowed</th>
                        <th className="px-5 py-3 font-medium text-[var(--color-ink-soft)] dark:text-white/60">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/10">
                      {permissions
                        .filter((p) => p.resource_title.toLowerCase().includes(search.toLowerCase()) || p.user_name.toLowerCase().includes(search.toLowerCase()))
                        .map((p) => (
                          <tr key={p.id} className="bg-white dark:bg-[var(--color-navy-900)]">
                            <td className="px-5 py-4 font-medium text-[var(--color-navy-900)] dark:text-white">{p.resource_title}</td>
                            <td className="px-5 py-4 text-[var(--color-ink-soft)] dark:text-white/60">{p.user_name}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${p.allowed ? 'bg-[var(--color-teal-100)] dark:bg-[var(--color-teal-500)]/10 text-[var(--color-teal-700)] dark:text-[var(--color-teal-400)]' : 'bg-[var(--color-vital-100)] dark:bg-[var(--color-vital-500)]/10 text-[var(--color-vital-700)] dark:text-[var(--color-vital-400)]'}`}>
                                {p.allowed ? <Shield size={13} /> : <ShieldOff size={13} />}
                                {p.allowed ? 'Allowed' : 'Blocked'}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <button onClick={() => handleSetPermission(p.resource_id, p.user_id, !p.allowed)} className="text-xs font-medium text-[var(--color-teal-500)] hover:underline">
                                {p.allowed ? 'Block' : 'Allow'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {permissions.length === 0 && (
                    <div className="p-8 text-center text-[var(--color-ink-soft)] dark:text-white/50">No permissions set yet.</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}