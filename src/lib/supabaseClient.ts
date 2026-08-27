import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly in development rather than silently hitting an undefined backend.
  console.error(
    'Missing Supabase environment variables. Copy .env.example to .env and fill in ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project settings.'
  )
}

// Note: not using the generic `createClient<Database>` form here. Our
// `Database` type in `types/database.ts` is a hand-written convenience
// shape (not the full generated schema Supabase's generic expects), so
// query results are cast to our app types at the call site instead. Once
// you run `supabase gen types typescript`, swap in the generated type here
// for full compile-time query safety.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
