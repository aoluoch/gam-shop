import { useState } from 'react'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { createOrder, type CreateOrderInput } from '@/services/order.service'
import { verifyPaystackPayment } from '@/services/payment.service'
import type { ShippingData } from './ShippingForm'

interface PaystackButtonProps {
  email: string
  shippingData: ShippingData
  onSuccess: (reference: string) => void
  onError: (error: string) => void
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

export function PaystackButton({ email, shippingData, onSuccess, onError, className }: PaystackButtonProps) {
  const { items, subtotal, shipping, tax, total } = useCart()
  const [loading, setLoading] = useState(false)

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

  if (!publicKey) {
    console.error('Paystack public key is not configured')
  }

  const generateReference = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `GAM-${timestamp}-${random}`
  }

  const handlePayment = () => {
    if (!publicKey) {
      onError('Payment gateway is not configured. Please contact support.')
      return
    }

    if (items.length === 0) {
      onError('Your cart is empty.')
      return
    }

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
        onError('Failed to load payment gateway. Please try again.')
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

    const reference = generateReference()

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: email,
      amount: total * 100, // Paystack expects amount in kobo/cents
      currency: 'KES',
      ref: reference,
      onClose: () => {
        setLoading(false)
      },
      callback: async (response) => {
        // Payment was successful, now create the order
        await handlePaymentSuccess(response.reference)
      },
    })

    handler.openIframe()
  }

  const handlePaymentSuccess = async (reference: string) => {
    try {
      // Verify payment with Supabase Edge Function before creating order
      const verification = await verifyPaystackPayment(reference)
      
      if (!verification.success) {
        setLoading(false)
        onError(`Payment verification failed: ${verification.error}. Reference: ${reference}`)
        return
      }

      // Create order only after payment is verified
      const orderInput: CreateOrderInput = {
        items,
        shippingAddress: {
          fullName: shippingData.fullName,
          email: shippingData.email,
          phone: shippingData.phone,
          addressLine1: shippingData.addressLine1,
          addressLine2: shippingData.addressLine2,
          city: shippingData.city,
          state: shippingData.state,
          postalCode: shippingData.postalCode,
          country: shippingData.country,
        },
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: 'paystack',
        paymentReference: reference,
      }

      const result = await createOrder(orderInput)

      if (result.success) {
        setLoading(false)
        onSuccess(reference)
      } else {
        setLoading(false)
        // Payment succeeded but order creation failed
        // This is a critical error - payment was taken but order wasn't created
        onError(`Payment successful but order creation failed: ${result.error}. Please contact support with reference: ${reference}`)
      }
    } catch {
      setLoading(false)
      onError(`An error occurred while creating your order. Reference: ${reference}. Please contact support.`)
    }
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
      disabled={loading || total === 0 || !publicKey}
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
