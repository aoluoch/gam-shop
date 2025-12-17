import { useState } from 'react'
import { Check } from 'lucide-react'
import { ShippingForm, type ShippingData } from './ShippingForm'
import { PaymentForm } from './PaymentForm'

type CheckoutStep = 'shipping' | 'payment'

interface CheckoutFormProps {
  onSuccess: (reference: string) => void
}

const initialShippingData: ShippingData = {
  fullName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Kenya',
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [shippingData, setShippingData] = useState<ShippingData>(initialShippingData)

  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === step)

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index < currentStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {index < currentStepIndex ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`
                  text-sm font-medium hidden sm:inline
                  ${index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'}
                `}
              >
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  w-12 sm:w-24 h-0.5 mx-2
                  ${index < currentStepIndex ? 'bg-primary' : 'bg-muted'}
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 'shipping' && (
        <ShippingForm
          data={shippingData}
          onChange={setShippingData}
          onNext={() => setStep('payment')}
        />
      )}

      {step === 'payment' && (
        <PaymentForm
          shippingData={shippingData}
          onBack={() => setStep('shipping')}
          onSuccess={onSuccess}
        />
      )}
    </div>
  )
}
