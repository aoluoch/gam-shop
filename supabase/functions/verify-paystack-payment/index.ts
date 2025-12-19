/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - Deno runtime, not Node.js
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    id: number
    status: string
    reference: string
    amount: number
    currency: string
    paid_at: string
    channel: string
    customer: {
      email: string
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference } = await req.json()

    if (!reference) {
      return new Response(
        JSON.stringify({ success: false, error: 'Reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')

    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY is not configured')
      return new Response(
        JSON.stringify({ success: false, error: 'Payment gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify transaction with Paystack API
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    })

    const result: PaystackVerifyResponse = await response.json()

    if (!response.ok || !result.status) {
      return new Response(
        JSON.stringify({ success: false, error: result.message || 'Verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if payment was successful
    if (result.data.status !== 'success') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Payment not successful. Status: ${result.data.status}` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return successful verification
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          amount: result.data.amount / 100, // Convert from kobo/cents
          currency: result.data.currency,
          reference: result.data.reference,
          paidAt: result.data.paid_at,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error verifying payment:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
