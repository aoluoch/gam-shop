export type ContactMessageStatus = 'unread' | 'read' | 'replied' | 'archived'

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: ContactMessageStatus
  userId?: string
  createdAt: string
  updatedAt: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}
