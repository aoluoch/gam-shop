import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { getUserProfile, updateUserProfile, getUserAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '@/services/user.service'
import type { UserProfile, Address } from '@/types/user'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setAddresses([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [profileData, addressesData] = await Promise.all([
        getUserProfile(user.id),
        getUserAddresses(user.id),
      ])
      setProfile(profileData)
      setAddresses(addressesData)
    } catch (err) {
      setError('Failed to load profile')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = useCallback(async (
    updates: Partial<Pick<UserProfile, 'fullName' | 'phone' | 'avatarUrl'>>
  ) => {
    if (!user) return { error: new Error('Not authenticated') }

    const result = await updateUserProfile(user.id, updates)
    if (!result.error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    }
    return result
  }, [user])

  const addAddress = useCallback(async (
    address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) return { data: null, error: new Error('Not authenticated') }

    const result = await createAddress(user.id, address)
    if (result.data) {
      setAddresses(prev => [result.data!, ...prev])
    }
    return result
  }, [user])

  const editAddress = useCallback(async (
    addressId: string,
    updates: Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ) => {
    const result = await updateAddress(addressId, updates)
    if (!result.error) {
      setAddresses(prev => prev.map(addr => 
        addr.id === addressId ? { ...addr, ...updates } : addr
      ))
    }
    return result
  }, [])

  const removeAddress = useCallback(async (addressId: string) => {
    const result = await deleteAddress(addressId)
    if (!result.error) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId))
    }
    return result
  }, [])

  const makeDefaultAddress = useCallback(async (addressId: string) => {
    if (!user) return { error: new Error('Not authenticated') }

    const result = await setDefaultAddress(user.id, addressId)
    if (!result.error) {
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      })))
    }
    return result
  }, [user])

  return {
    profile,
    addresses,
    loading,
    error,
    refreshProfile: fetchProfile,
    updateProfile,
    addAddress,
    editAddress,
    removeAddress,
    makeDefaultAddress,
  }
}
