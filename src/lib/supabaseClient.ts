import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
let validSupabaseUrl: string | null = null

try {
  const parsedUrl = new URL(supabaseUrl ?? '')
  if (parsedUrl.protocol === 'https:' && parsedUrl.hostname.endsWith('.supabase.co')) {
    validSupabaseUrl = parsedUrl.toString().replace(/\/$/, '')
  }
} catch {
  validSupabaseUrl = null
}

const hasSupabaseConfig = Boolean(validSupabaseUrl && supabaseAnonKey)

if (!hasSupabaseConfig) {
  console.error(
    'Missing Supabase environment variables. Add ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project settings.'
  )
}

// Note: not using the generic `createClient<Database>` form here. Our
// `Database` type in `types/database.ts` is a hand-written convenience
// shape (not the full generated schema Supabase's generic expects), so
// query results are cast to our app types at the call site instead. Once
// you run `supabase gen types typescript`, swap in the generated type here
// for full compile-time query safety.
export const supabase = createClient(
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
