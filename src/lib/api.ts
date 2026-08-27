const API_BASE = 'http://localhost:3002/api'

function getToken() {
  try {
    const stored = localStorage.getItem('medilearn_token')
    return stored || ''
  } catch {
    return ''
  }
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = await res.json()
      message = body.error || message
    } catch {
      // ignore json parse errors
    }
    throw new Error(message)
  }

  if (res.status === 204) return null

  const text = await res.text()
  if (!text) return null
  return JSON.parse(text)
}

export async function apiRegister(fullName: string, email: string, password: string) {
  const res = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  })
  if (res?.token) {
    localStorage.setItem('medilearn_token', res.token)
  }
  return res
}

export async function apiLogin(email: string, password: string) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (res?.token) {
    localStorage.setItem('medilearn_token', res.token)
  }
  return res
}

export async function apiLogout() {
  localStorage.removeItem('medilearn_token')
}

export async function apiGetMe() {
  const token = getToken()
  if (!token) return null
  try {
    const res = await request('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res?.user ?? null
  } catch {
    localStorage.removeItem('medilearn_token')
    return null
  }
}

export async function apiGetCourses() {
  const res = await request('/courses')
  return (res?.data ?? []) as Array<{ id: string; title: string; slug: string; level: string; duration_weeks: number }>
}

export async function apiGetCourse(slug: string | undefined) {
  if (!slug) return null
  const res = await request(`/courses/${encodeURIComponent(slug)}`)
  return res?.data ?? null
}

export async function apiGetEnrollment(courseId: string, studentId: string) {
  const res = await request(`/enrollments/course/${encodeURIComponent(courseId)}?studentId=${encodeURIComponent(studentId)}`)
  return res?.data ?? null
}

export async function apiApplyForCourse(courseId: string, studentId: string) {
  const res = await request(`/enrollments/course/${encodeURIComponent(courseId)}/apply`, {
    method: 'POST',
    body: JSON.stringify({ studentId }),
  })
  return res?.data ?? null
}

export async function apiGetAdminEnrollments() {
  const res = await request('/admin/enrollments')
  return (res?.data ?? []) as Array<{
    id: string
    course_title: string
    course_slug: string
    student_name: string
    student_email: string
    status: string
    applied_at: string
  }>
}

export async function apiUpdateEnrollmentStatus(id: string, status: string) {
  const res = await request(`/admin/enrollments/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return res?.data ?? null
}

export async function apiGetAdminResources(courseId?: string) {
  const query = courseId ? `?courseId=${encodeURIComponent(courseId)}` : ''
  const res = await request(`/admin/resources${query}`)
  return (res?.data ?? []) as Array<{
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
  }>
}

export async function apiUploadResource(formData: FormData) {
  const token = getToken()
  const res = await fetch(`${API_BASE}/admin/resources/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = await res.json()
      message = body.error || message
    } catch {
      // ignore
    }
    throw new Error(message)
  }
  return res.json()
}

export async function apiDeleteResource(id: string) {
  const res = await request(`/admin/resources/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return res?.data ?? null
}

export async function apiGetAdminUsers() {
  const res = await request('/admin/users')
  return (res?.data ?? []) as Array<{
    id: string
    full_name: string
    email: string
    role: string
    created_at: string
  }>
}

export async function apiUpdateUserRole(id: string, role: string) {
  const res = await request(`/admin/users/${encodeURIComponent(id)}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
  return res?.data ?? null
}

export async function apiGetPermissions(resourceId?: string, userId?: string) {
  const params = new URLSearchParams()
  if (resourceId) params.set('resourceId', resourceId)
  if (userId) params.set('userId', userId)
  const query = params.toString() ? `?${params.toString()}` : ''
  const res = await request(`/admin/permissions${query}`)
  return (res?.data ?? []) as Array<{
    id: string
    resource_id: string
    user_id: string
    resource_title: string
    user_name: string
    allowed: number
    created_at: string
  }>
}

export async function apiSetPermission(resourceId: string, userId: string, allowed: boolean) {
  const res = await request('/admin/permissions', {
    method: 'POST',
    body: JSON.stringify({ resourceId, userId, allowed }),
  })
  return res?.data ?? null
}

export async function apiGetCourseResources(courseId: string) {
  const res = await request(`/resources/course/${encodeURIComponent(courseId)}`)
  return (res?.data ?? []) as Array<{
    id: string
    title: string
    description: string
    type: string
    file_name: string
    mime_type: string
    size_bytes: number
    is_downloadable: number
    created_at: string
  }>
}

export async function apiDownloadResource(filename: string, userId?: string) {
  const token = getToken()
  const url = `${API_BASE}/resources/download/${encodeURIComponent(filename)}${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = await res.json()
      message = body.error || message
    } catch {
      // ignore
    }
    throw new Error(message)
  }
  return res.blob()
}
