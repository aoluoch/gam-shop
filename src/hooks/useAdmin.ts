import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { checkIsAdmin, getUserProfile } from '@/services/user.service'
import type { UserProfile, UserRole } from '@/types/user'

export function useAdmin() {
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false)
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        const [adminStatus, userProfile] = await Promise.all([
          checkIsAdmin(user.id),
          getUserProfile(user.id),
        ])
        setIsAdmin(adminStatus)
        setProfile(userProfile)
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      checkAdminStatus()
    }
  }, [user, authLoading])

  const role: UserRole = isAdmin ? 'admin' : 'customer'

  return {
    isAdmin,
    role,
    profile,
    loading: authLoading || loading,
  }
}
