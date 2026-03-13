import { useState, useEffect, useMemo } from 'react'
import { MapPin, User, Phone, Building2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useProfile } from '@/hooks/useProfile'
import { useToast } from '@/hooks/useToast'
import type { Address } from '@/types/user'

export interface ShippingData {
  fullName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface ShippingFormProps {
  data: ShippingData
  onChange: (data: ShippingData) => void
  onNext: () => void
}

export function ShippingForm({ data, onChange, onNext }: ShippingFormProps) {
  const { user } = useAuth()
  const { setShippingCity, calculateShippingWithCity } = useCart()
  const { addresses, addAddress, loading: addressesLoading } = useProfile()
  const { success, error: showError } = useToast()
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({})
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [saveToAccount, setSaveToAccount] = useState(true)
  const [setAsDefault, setSetAsDefault] = useState(false)

  // Calculate estimated shipping fee based on city using rates from database
  const estimatedShipping = useMemo(() => {
    if (!data.city.trim()) {
      return null
    }
    return calculateShippingWithCity(data.city)
  }, [data.city, calculateShippingWithCity])

  // Initialize selection with default address if available
  useEffect(() => {
    if (useNewAddress) return
    if (!addresses || addresses.length === 0) return

    // If we already have a selected address, keep it
    if (selectedAddressId) return

    const defaultAddress = addresses.find(a => a.isDefault) ?? addresses[0]
    if (!defaultAddress) return

    // Defer state updates to avoid synchronous setState inside the effect body
    queueMicrotask(() => {
      setSelectedAddressId(prev => prev ?? defaultAddress.id)
      onChange({
        fullName: defaultAddress.fullName,
        email: data.email,
        phone: defaultAddress.phone ?? '',
        addressLine1: defaultAddress.addressLine1,
        addressLine2: defaultAddress.addressLine2 ?? '',
        city: defaultAddress.city,
        state: defaultAddress.state ?? '',
        postalCode: defaultAddress.postalCode ?? '',
        country: defaultAddress.country,
      })
      setErrors({})
    })
  }, [addresses, data.email, onChange, selectedAddressId, useNewAddress])

  // Update cart context when city changes
  useEffect(() => {
    if (data.city.trim()) {
      setShippingCity(data.city)
    } else {
      setShippingCity(null)
    }
  }, [data.city, setShippingCity])

  useEffect(() => {
    if (user?.email && !data.email) {
      onChange({ ...data, email: user.email })
    }
  }, [user, data, onChange])

  const handleChange = (field: keyof ShippingData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingData, string>> = {}

    if (!data.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!data.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Invalid email'
    if (!data.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!data.addressLine1.trim()) newErrors.addressLine1 = 'Address is required'
    if (!data.city.trim()) newErrors.city = 'City is required'
    if (!data.country.trim()) newErrors.country = 'Country is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      // If using a new address, optionally save it to the user's account
      if (useNewAddress && user && saveToAccount) {
        try {
          const newAddress: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
            label: 'Checkout address',
            fullName: data.fullName,
            phone: data.phone || null,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2 || null,
            city: data.city,
            state: data.state || null,
            postalCode: data.postalCode || null,
            country: data.country || 'Kenya',
            isDefault: setAsDefault,
          }

          const result = await addAddress(newAddress)
          if (result.error) {
            showError(result.error.message ?? 'Failed to save address', 'Error')
          } else {
            success('Address saved to your account')
          }
        } catch (err) {
          console.error('Error saving checkout address', err)
          showError('Failed to save address', 'Error')
        }
      }

      onNext()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {user && !addressesLoading && addresses.length > 0 && (
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Saved addresses</p>
                <button
                  type="button"
                  className="text-xs text-primary underline-offset-2 hover:underline"
                  onClick={() => {
                    setUseNewAddress(true)
                    setSelectedAddressId(null)
                    onChange({
                      ...data,
                      addressLine1: '',
                      addressLine2: '',
                      city: '',
                      state: '',
                      postalCode: '',
                      country: data.country || 'Kenya',
                    })
                  }}
                >
                  Use a new address
                </button>
              </div>

              {!useNewAddress && (
                <div className="grid gap-3 md:grid-cols-2">
                  {addresses.map(address => (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => {
                        setUseNewAddress(false)
                        setSelectedAddressId(address.id)
                        onChange({
                          fullName: address.fullName,
                          email: data.email,
                          phone: address.phone ?? '',
                          addressLine1: address.addressLine1,
                          addressLine2: address.addressLine2 ?? '',
                          city: address.city,
                          state: address.state ?? '',
                          postalCode: address.postalCode ?? '',
                          country: address.country,
                        })
                        setErrors({})
                      }}
                      className={`text-left border rounded-lg p-3 text-xs sm:text-sm transition-colors ${
                        selectedAddressId === address.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-medium">{address.label}</span>
                        {address.isDefault && (
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {address.fullName}
                        <br />
                        {address.addressLine1}
                        {address.addressLine2 && (
                          <>
                            , {address.addressLine2}
                          </>
                        )}
                        <br />
                        {address.city}
                        {address.state && `, ${address.state}`}{' '}
                        {address.postalCode}
                        <br />
                        {address.country}
                        {address.phone && (
                          <>
                            <br />
                            {address.phone}
                          </>
                        )}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {useNewAddress && (
                <div className="text-xs text-muted-foreground">
                  You are entering a new shipping address. You can save it to your account below.
                </div>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={data.fullName}
                onChange={handleChange('fullName')}
                className={errors.fullName ? 'border-destructive' : ''}
              />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={data.email}
                onChange={handleChange('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+254 7XX XXX XXX"
              value={data.phone}
              onChange={handleChange('phone')}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1" className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              Street Address *
            </Label>
            <Input
              id="addressLine1"
              placeholder="123 Main Street"
              value={data.addressLine1}
              onChange={handleChange('addressLine1')}
              className={errors.addressLine1 ? 'border-destructive' : ''}
            />
            {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Apartment, Suite, etc. (optional)</Label>
            <Input
              id="addressLine2"
              placeholder="Apt 4B"
              value={data.addressLine2}
              onChange={handleChange('addressLine2')}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City / County*</Label>
              <Input
                id="city"
                placeholder="Nairobi"
                value={data.city}
                onChange={handleChange('city')}
                className={errors.city ? 'border-destructive' : ''}
              />
              {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              {estimatedShipping !== null && data.city.trim() && (
                <p className="text-xs text-muted-foreground">
                  Estimated delivery fee: {estimatedShipping === 0 ? 'Free' : `KES ${estimatedShipping.toLocaleString()}`}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / County</Label>
              <Input
                id="state"
                placeholder="Nairobi County"
                value={data.state}
                onChange={handleChange('state')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="00100"
                value={data.postalCode}
                onChange={handleChange('postalCode')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              placeholder="Kenya"
              value={data.country}
              onChange={handleChange('country')}
              className={errors.country ? 'border-destructive' : ''}
            />
            {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
          </div>

          {useNewAddress && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center gap-2">
                <input
                  id="saveToAccount"
                  type="checkbox"
                  checked={saveToAccount}
                  onChange={e => setSaveToAccount(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="saveToAccount" className="text-sm">
                  Save this address to my account
                </Label>
              </div>
              <div className="flex items-center gap-2 pl-5">
                <input
                  id="setAsDefault"
                  type="checkbox"
                  checked={setAsDefault}
                  onChange={e => setSetAsDefault(e.target.checked)}
                  disabled={!saveToAccount}
                  className="h-4 w-4 rounded border-border disabled:opacity-50"
                />
                <Label htmlFor="setAsDefault" className="text-sm text-muted-foreground">
                  Make this my default shipping address
                </Label>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            Continue to Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
