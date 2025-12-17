export type UserRole = 'customer' | 'admin'

export interface UserProfile {
  id: string
  fullName: string | null
  avatarUrl: string | null
  phone: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  userId: string
  label: string
  fullName: string
  phone: string | null
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string | null
  postalCode: string | null
  country: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface UserSettings {
  emailNotifications: boolean
  orderUpdates: boolean
  promotionalEmails: boolean
}
