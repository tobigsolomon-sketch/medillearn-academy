export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type CourseLevel = 'foundation' | 'intermediate' | 'advanced'
export type AppRole = 'student' | 'instructor' | 'admin' | 'super_admin'

export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  country: string | null
  student_id: string | null
  role: AppRole
  created_at: string
}

export interface Course {
  id: string
  slug: string
  title: string
  tagline: string | null
  description: string
  objectives: string[] | null
  requirements: string[] | null
  level: CourseLevel
  duration_weeks: number
  module_count: number
  instructor_name: string
  cover_image_url: string | null
  rating: number | null
  enrollment_count: number
  is_published: boolean
  is_free: boolean
  price_cents: number | null
  created_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  status: EnrollmentStatus
  applied_at: string
  decided_at: string | null
  decided_by: string | null
  note: string | null
}

// Minimal Database shape for supabase-js generics. Extend with
// `supabase gen types typescript` once the project schema is finalized.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string; full_name: string; email: string }
        Update: Partial<Profile>
      }
      courses: {
        Row: Course
        Insert: Partial<Course> & { title: string; description: string }
        Update: Partial<Course>
      }
      enrollments: {
        Row: Enrollment
        Insert: Partial<Enrollment> & { student_id: string; course_id: string }
        Update: Partial<Enrollment>
      }
    }
  }
}
