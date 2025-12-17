import { useState, useEffect } from 'react'
import { MapPin, User, Phone, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

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
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({})

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
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
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Nairobi"
                value={data.city}
                onChange={handleChange('city')}
                className={errors.city ? 'border-destructive' : ''}
              />
              {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
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

          <Button type="submit" className="w-full" size="lg">
            Continue to Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
