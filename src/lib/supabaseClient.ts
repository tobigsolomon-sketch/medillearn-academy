import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const demoMode = import.meta.env.VITE_DEMO_MODE === 'true'
let validSupabaseUrl: string | null = null

if (!demoMode) {
  try {
    const parsedUrl = new URL(supabaseUrl ?? '')
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      validSupabaseUrl = parsedUrl.toString().replace(/\/$/, '')
    }
  } catch {
    validSupabaseUrl = null
  }
}

const hasSupabaseConfig = Boolean(validSupabaseUrl && supabaseAnonKey) || demoMode

if (!hasSupabaseConfig) {
  console.error(
    'Missing Supabase environment variables. Add ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project settings.'
  )
}

export const supabase = demoMode
  ? ({} as unknown as ReturnType<typeof createClient>)
  : createClient(
      validSupabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-anon-key',
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    )
