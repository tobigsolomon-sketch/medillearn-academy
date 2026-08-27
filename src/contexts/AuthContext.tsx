import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../types/database'

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (opts: { email: string; password: string; fullName: string }) => Promise<{ error: string | null }>
  signIn: (opts: { email: string; password: string }) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthCredentials = { email: string; password: string }

async function signUp({ email, password, fullName }: { email: string; password: string; fullName: string }) {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) return { error: error.message }
  } catch (signupError) {
    if (signupError instanceof TypeError) {
      return {
        error: 'Unable to reach Supabase. Check the Vercel environment variables and Supabase project URL.',
      }
    }
    return { error: signupError instanceof Error ? signupError.message : 'Account creation failed.' }
  }
  return { error: null }
}

async function signIn({ email, password }: AuthCredentials) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error: error ? error.message : null }
}

async function signOut() {
  await supabase.auth.signOut()
}

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (!error && data) setProfile(data as Profile)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session?.user) loadProfile(data.session.user.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession?.user) {
        loadProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const refreshProfile = useCallback(async () => {
    if (session?.user) await loadProfile(session.user.id)
  }, [session])

  const contextValue = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
    }),
    [session, profile, loading, refreshProfile],
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
