import { useState } from 'react'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'

interface PaystackButtonProps {
  email: string
  onSuccess: (reference: string) => void
  className?: string
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: PaystackConfig) => { openIframe: () => void }
    }
  }
}

interface PaystackConfig {
  key: string
  email: string
  amount: number
  currency: string
  ref: string
  onClose: () => void
  callback: (response: { reference: string }) => void
}

export function PaystackButton({ email, onSuccess, className }: PaystackButtonProps) {
  const { total } = useCart()
  const [loading, setLoading] = useState(false)

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxx'

  const generateReference = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `GAM-${timestamp}-${random}`
  }

  const handlePayment = () => {
    setLoading(true)

    // Check if Paystack is loaded
    if (!window.PaystackPop) {
      // Load Paystack script dynamically
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      script.onload = () => initializePayment()
      script.onerror = () => {
        setLoading(false)
        alert('Failed to load payment gateway. Please try again.')
      }
      document.body.appendChild(script)
    } else {
      initializePayment()
    }
  }

  const initializePayment = () => {
    if (!window.PaystackPop) {
      setLoading(false)
      return
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: email,
      amount: total * 100, // Paystack expects amount in kobo/cents
      currency: 'KES',
      ref: generateReference(),
      onClose: () => {
        setLoading(false)
      },
      callback: (response) => {
        setLoading(false)
        onSuccess(response.reference)
      },
    })

    handler.openIframe()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || total === 0}
      size="lg"
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Lock className="mr-2 h-4 w-4" />
          Pay {formatPrice(total)}
        </>
      )}
    </Button>
  )
}
