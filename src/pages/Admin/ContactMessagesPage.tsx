import { useEffect, useState, useCallback } from 'react'
import { ContactMessagesTable } from '@/components/admin/ContactMessagesTable'
import { getContactMessages, updateMessageStatus, deleteContactMessage } from '@/services/contact.service'
import type { ContactMessage, ContactMessageStatus } from '@/types/contact'
import { useToast } from '@/hooks/useToast'

export function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useToast()

  const loadMessages = useCallback(async () => {
    try {
      const data = await getContactMessages()
      setMessages(data)
    } catch (error) {
      console.error('Error loading contact messages:', error)
      showError('Failed to load contact messages')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  async function handleStatusChange(id: string, status: ContactMessageStatus) {
    try {
      const { error } = await updateMessageStatus(id, status)
      if (error) {
        showError(error.message)
        return
      }
      setMessages(messages.map((m) => (m.id === id ? { ...m, status } : m)))
      success(`Message marked as ${status}`)
    } catch (error) {
      console.error('Error updating message status:', error)
      showError('Failed to update message status')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this message?')) {
      return
    }
    
    try {
      const { error } = await deleteContactMessage(id)
      if (error) {
        showError(error.message)
        return
      }
      setMessages(messages.filter((m) => m.id !== id))
      success('Message deleted successfully')
    } catch (error) {
      console.error('Error deleting message:', error)
      showError('Failed to delete message')
    }
  }

  const unreadCount = messages.filter((m) => m.status === 'unread').length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">
          View and manage messages from the contact form
          {unreadCount > 0 && (
            <span className="ml-2 text-primary font-medium">
              ({unreadCount} unread)
            </span>
          )}
        </p>
      </div>

      <ContactMessagesTable
        messages={messages}
        loading={loading}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  )
}
