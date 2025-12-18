import { useState } from 'react'
import { Search, Users, Shield, ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserRole } from '@/types/user'
import type { CustomerWithOrders } from '@/services/admin.service'
import { cn } from '@/lib/utils'

interface CustomerTableProps {
  customers: CustomerWithOrders[]
  onRoleChange: (userId: string, role: UserRole) => void
  loading?: boolean
}

export function CustomerTable({ customers, onRoleChange, loading }: CustomerTableProps) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [confirmRoleChange, setConfirmRoleChange] = useState<string | null>(null)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || customer.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleRoleToggle = (userId: string, currentRole: UserRole) => {
    if (confirmRoleChange === userId) {
      const newRole: UserRole = currentRole === 'admin' ? 'customer' : 'admin'
      onRoleChange(userId, newRole)
      setConfirmRoleChange(null)
    } else {
      setConfirmRoleChange(userId)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Orders</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Spent</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {customer.avatarUrl ? (
                          <img
                            src={customer.avatarUrl}
                            alt={customer.fullName || 'Customer'}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {customer.fullName?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{customer.fullName || 'Unnamed'}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(customer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{customer.email || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                          customer.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">{customer.orderCount}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRoleToggle(customer.id, customer.role)}
                          className={cn(
                            confirmRoleChange === customer.id && 
                            (customer.role === 'admin' ? 'text-red-600' : 'text-green-600')
                          )}
                          title={
                            confirmRoleChange === customer.id
                              ? `Click again to confirm ${customer.role === 'admin' ? 'removing' : 'granting'} admin`
                              : customer.role === 'admin'
                              ? 'Remove admin role'
                              : 'Make admin'
                          }
                        >
                          {customer.role === 'admin' ? (
                            <ShieldOff className="h-4 w-4" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
