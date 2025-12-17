import { useState } from 'react'
import { MapPin, Plus, Pencil, Trash2, Star, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProfile } from '@/hooks/useProfile'
import { useToast } from '@/hooks/useToast'
import { AddressForm } from './AddressForm'
import type { Address } from '@/types/user'

export function AddressBook() {
  const { addresses, loading, addAddress, editAddress, removeAddress, makeDefaultAddress } = useProfile()
  const { success, error: showError } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const handleAddAddress = async (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const result = await addAddress(address)
    if (result.error) {
      showError(result.error.message, 'Error')
    } else {
      success('Address added successfully')
      setShowForm(false)
    }
  }

  const handleEditAddress = async (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!editingAddress) return

    const result = await editAddress(editingAddress.id, address)
    if (result.error) {
      showError(result.error.message, 'Error')
    } else {
      success('Address updated successfully')
      setEditingAddress(null)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    const result = await removeAddress(addressId)
    if (result.error) {
      showError(result.error.message, 'Error')
    } else {
      success('Address deleted successfully')
    }
  }

  const handleSetDefault = async (addressId: string) => {
    const result = await makeDefaultAddress(addressId)
    if (result.error) {
      showError(result.error.message, 'Error')
    } else {
      success('Default address updated')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (showForm || editingAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</CardTitle>
          <CardDescription>
            {editingAddress ? 'Update your address details' : 'Enter your shipping address details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddressForm
            initialData={editingAddress || undefined}
            onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
            onCancel={() => {
              setShowForm(false)
              setEditingAddress(null)
            }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Your Addresses</h3>
          <p className="text-sm text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg mb-2">No addresses saved</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add an address to make checkout faster
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map(address => (
            <Card key={address.id} className={address.isDefault ? 'border-primary' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{address.label}</span>
                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        <Star className="h-3 w-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditingAddress(address)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p className="font-medium text-foreground">{address.fullName}</p>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>{address.city}{address.state && `, ${address.state}`}</p>
                  <p>{address.country}{address.postalCode && ` ${address.postalCode}`}</p>
                  {address.phone && <p>{address.phone}</p>}
                </div>
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
