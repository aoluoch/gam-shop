import { CreditCard, Shield, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaystackButton } from './PaystackButton'
import type { ShippingData } from './ShippingForm'

interface PaymentFormProps {
  shippingData: ShippingData
  onBack: () => void
  onSuccess: (reference: string) => void
}

export function PaymentForm({ shippingData, onBack, onSuccess }: PaymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">Shipping to:</h4>
          <p className="text-sm text-muted-foreground">
            {shippingData.fullName}<br />
            {shippingData.addressLine1}
            {shippingData.addressLine2 && <>, {shippingData.addressLine2}</>}<br />
            {shippingData.city}, {shippingData.state} {shippingData.postalCode}<br />
            {shippingData.country}
          </p>
          <p className="text-sm text-muted-foreground">
            {shippingData.phone} • {shippingData.email}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Your payment is secured with Paystack</span>
          </div>

          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pay with Paystack</span>
              <div className="flex items-center gap-2">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png" 
                  alt="Card payments"
                  className="h-6"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Accepts Visa, Mastercard, Mobile Money (M-Pesa, Airtel Money), Bank Transfer, and more.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <PaystackButton
            email={shippingData.email}
            onSuccess={onSuccess}
            className="flex-1"
          />
        </div>

        <p className="text-xs text-muted-foreground text-center">
          By completing your purchase, you agree to our{' '}
          <a href="/terms" className="text-primary hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
      </CardContent>
    </Card>
  )
}
