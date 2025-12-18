import { useEffect, useState, useCallback } from 'react'
import { CustomerTable } from '@/components/admin'
import { getCustomers, updateUserRole, type CustomerWithOrders } from '@/services/admin.service'
import type { UserRole } from '@/types/user'
import { useToast } from '@/hooks/useToast'

export function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithOrders[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useToast()

  const loadCustomers = useCallback(async () => {
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error('Error loading customers:', error)
      showError('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  async function handleRoleChange(userId: string, role: UserRole) {
    try {
      const { error } = await updateUserRole(userId, role)
      if (error) {
        showError(error.message)
        return
      }
      setCustomers(customers.map((c) => (c.id === userId ? { ...c, role } : c)))
      success(`User role updated to ${role}`)
    } catch (error) {
      console.error('Error updating user role:', error)
      showError('Failed to update user role')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage users and their roles</p>
      </div>

      <CustomerTable
        customers={customers}
        onRoleChange={handleRoleChange}
        loading={loading}
      />
    </div>
  )
}
