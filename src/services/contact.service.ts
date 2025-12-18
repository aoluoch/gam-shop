import { supabase } from './supabase'
import type { ContactMessage, ContactFormData, ContactMessageStatus } from '@/types/contact'

// ============================================
// SUBMIT CONTACT MESSAGE (PUBLIC)
// ============================================

export async function submitContactMessage(
  formData: ContactFormData
): Promise<{ data: ContactMessage | null; error: Error | null }> {
  const { data: userData } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      user_id: userData?.user?.id || null,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  return { data: mapContactMessage(data), error: null }
}

// ============================================
// ADMIN: GET ALL CONTACT MESSAGES
// ============================================

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact messages:', error)
    return []
  }

  return data.map(mapContactMessage)
}

// ============================================
// ADMIN: UPDATE MESSAGE STATUS
// ============================================

export async function updateMessageStatus(
  id: string,
  status: ContactMessageStatus
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id)

  return { error: error ? new Error(error.message) : null }
}

// ============================================
// ADMIN: DELETE MESSAGE
// ============================================

export async function deleteContactMessage(
  id: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)

  return { error: error ? new Error(error.message) : null }
}

// ============================================
// ADMIN: GET UNREAD COUNT
// ============================================

export async function getUnreadCount(): Promise<number> {
  const { count, error } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unread')

  if (error) {
    console.error('Error fetching unread count:', error)
    return 0
  }

  return count || 0
}

// ============================================
// HELPER MAPPER
// ============================================

function mapContactMessage(data: Record<string, unknown>): ContactMessage {
  return {
    id: data.id as string,
    name: data.name as string,
    email: data.email as string,
    subject: data.subject as string,
    message: data.message as string,
    status: data.status as ContactMessageStatus,
    userId: data.user_id as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  }
}
