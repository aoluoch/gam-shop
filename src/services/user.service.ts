import { supabase } from './supabase'
import type { UserProfile, Address } from '@/types/user'

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return {
    id: data.id,
    fullName: data.full_name,
    avatarUrl: data.avatar_url,
    phone: data.phone,
    role: data.role || 'customer',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, 'fullName' | 'phone' | 'avatarUrl'>>
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.fullName,
      phone: updates.phone,
      avatar_url: updates.avatarUrl,
    })
    .eq('id', userId)

  return { error: error ? new Error(error.message) : null }
}

export async function getUserAddresses(userId: string): Promise<Address[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching addresses:', error)
    return []
  }

  return data.map(addr => ({
    id: addr.id,
    userId: addr.user_id,
    label: addr.label,
    fullName: addr.full_name,
    phone: addr.phone,
    addressLine1: addr.address_line1,
    addressLine2: addr.address_line2,
    city: addr.city,
    state: addr.state,
    postalCode: addr.postal_code,
    country: addr.country,
    isDefault: addr.is_default,
    createdAt: addr.created_at,
    updatedAt: addr.updated_at,
  }))
}

export async function createAddress(
  userId: string,
  address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<{ data: Address | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('addresses')
    .insert({
      user_id: userId,
      label: address.label,
      full_name: address.fullName,
      phone: address.phone,
      address_line1: address.addressLine1,
      address_line2: address.addressLine2,
      city: address.city,
      state: address.state,
      postal_code: address.postalCode,
      country: address.country,
      is_default: address.isDefault,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  return {
    data: {
      id: data.id,
      userId: data.user_id,
      label: data.label,
      fullName: data.full_name,
      phone: data.phone,
      addressLine1: data.address_line1,
      addressLine2: data.address_line2,
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      country: data.country,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
    error: null,
  }
}

export async function updateAddress(
  addressId: string,
  updates: Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('addresses')
    .update({
      label: updates.label,
      full_name: updates.fullName,
      phone: updates.phone,
      address_line1: updates.addressLine1,
      address_line2: updates.addressLine2,
      city: updates.city,
      state: updates.state,
      postal_code: updates.postalCode,
      country: updates.country,
      is_default: updates.isDefault,
    })
    .eq('id', addressId)

  return { error: error ? new Error(error.message) : null }
}

export async function deleteAddress(addressId: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)

  return { error: error ? new Error(error.message) : null }
}

export async function setDefaultAddress(
  userId: string,
  addressId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', addressId)
    .eq('user_id', userId)

  return { error: error ? new Error(error.message) : null }
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return false
  }

  return data.role === 'admin'
}
