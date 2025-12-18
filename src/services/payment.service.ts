import { supabase } from './supabase'

export interface PaymentVerificationResult {
  success: boolean
  data?: {
    amount: number
    currency: string
    reference: string
    paidAt: string
  }
  error?: string
}

export async function verifyPaystackPayment(reference: string): Promise<PaymentVerificationResult> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
      body: { reference },
    })

    if (error) {
      console.error('Payment verification error:', error)
      return { success: false, error: error.message || 'Payment verification failed' }
    }

    return data as PaymentVerificationResult
  } catch (error) {
    console.error('Unexpected error verifying payment:', error)
    return { success: false, error: 'An unexpected error occurred during payment verification' }
  }
}
