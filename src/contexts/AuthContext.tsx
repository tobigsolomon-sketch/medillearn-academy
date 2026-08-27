import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiLogin, apiLogout, apiGetMe, apiRegister } from '../lib/api'
import type { Profile } from '../types/database'

interface AuthContextValue {
  session: { user: { id: string; email: string; full_name?: string; role?: string } } | null
  user: { id: string; email: string; full_name?: string; role?: string } | null
  profile: Profile | null
  loading: boolean
  signUp: (opts: { email: string; password: string; fullName: string }) => Promise<{ error: string | null }>
  signIn: (opts: { email: string; password: string }) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthCredentials = { email: string; password: string }

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [session, setSession] = useState<AuthContextValue['session']>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfileFromToken() {
    const user = await apiGetMe()
    if (user) {
      setProfile({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: null,
        avatar_url: null,
        country: null,
        student_id: null,
        role: (user.role as Profile['role']) || 'student',
        created_at: new Date().toISOString(),
      })
      setSession({ user })
    } else {
      setProfile(null)
      setSession(null)
    }
  }

  useEffect(() => {
    loadProfileFromToken().finally(() => setLoading(false))
  }, [])

  const refreshProfile = useCallback(async () => {
    await loadProfileFromToken()
  }, [])

  async function signUp({ email, password, fullName }: { email: string; password: string; fullName: string }) {
    try {
      const res = await apiRegister(fullName, email, password)
      if (!res?.error) {
        await loadProfileFromToken()
      }
      return { error: res?.error ?? null }
    } catch (signupError) {
      if (signupError instanceof TypeError) {
        return {
          error: 'Unable to reach the server. Make sure the backend is running on http://localhost:3001.',
        }
      }
      return { error: signupError instanceof Error ? signupError.message : 'Account creation failed.' }
    }
  }

  async function signIn({ email, password }: AuthCredentials) {
    try {
      const res = await apiLogin(email, password)
      if (!res?.error) {
        await loadProfileFromToken()
      }
      return { error: res?.error ?? null }
    } catch (signinError) {
      if (signinError instanceof TypeError) {
        return {
          error: 'Unable to reach the server. Make sure the backend is running on http://localhost:3001.',
        }
      }
      return { error: signinError instanceof Error ? signinError.message : 'Sign in failed.' }
    }
  }

  async function signOut() {
    await apiLogout()
    setSession(null)
    setProfile(null)
  }

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
    [session, profile, loading, refreshProfile, signIn, signUp, signOut],
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within anAuthProvider')
  return ctx
}
