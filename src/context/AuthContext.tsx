import { useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase'
import { AuthContext } from './AuthContextDef'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'PASSWORD_RECOVERY') {
          // Handle password recovery event - user clicked reset link
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    // Supabase returns a user with empty identities if email already exists
    // (when email confirmation is enabled, to prevent email enumeration)
    if (!error && data.user && (!data.user.identities || data.user.identities.length === 0)) {
      return {
        error: {
          message: 'User already registered',
          name: 'AuthApiError',
          status: 400,
        } as import('@supabase/supabase-js').AuthError,
      }
    }

    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // If login succeeded, verify email is confirmed
    if (!error && data.user && !data.user.email_confirmed_at) {
      // Sign out the unverified user immediately
      await supabase.auth.signOut()
      return {
        error: {
          message: 'Email not confirmed',
          name: 'AuthApiError',
          status: 400,
        } as import('@supabase/supabase-js').AuthError,
      }
    }

    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}