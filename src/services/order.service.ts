import { supabase } from './supabase'
import type { CartItem } from '@/types/cart'
import type { Order } from '@/types/order'

export interface CreateOrderInput {
  items: CartItem[]
  shippingAddress: {
    fullName: string
    email: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
  paymentReference: string
  notes?: string
}

export interface CreateOrderResult {
  success: boolean
  order?: Order
  error?: string
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Generate order number
    const { data: orderNumberData, error: orderNumberError } = await supabase
      .rpc('generate_order_number')

    if (orderNumberError) {
      console.error('Error generating order number:', orderNumberError)
      return { success: false, error: 'Failed to generate order number' }
    }

    const orderNumber = orderNumberData as string

    // Create the order with payment_status as 'paid' since payment was already confirmed
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        subtotal: input.subtotal,
        shipping: input.shipping,
        tax: input.tax,
        total: input.total,
        status: 'processing', // Start as processing since payment is confirmed
        payment_status: 'paid', // Payment already confirmed via Paystack
        payment_method: input.paymentMethod,
        payment_reference: input.paymentReference,
        notes: input.notes,
        shipping_address: input.shippingAddress,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return { success: false, error: 'Failed to create order' }
    }

    // Create order items
    const orderItems = input.items.map(item => ({
      order_id: orderData.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.thumbnail || item.product.images[0] || '',
      quantity: item.quantity,
      price: item.product.price,
      size: item.selectedSize,
      color: item.selectedColor,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Order was created but items failed - this is a partial failure
      // In production, you'd want to handle this with a transaction
    }

    // Update product stock
    for (const item of input.items) {
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: item.product.stock - item.quantity })
        .eq('id', item.product.id)
        .gte('stock', item.quantity)

      if (stockError) {
        console.error('Error updating stock for product:', item.product.id, stockError)
      }
    }

    // Map the order to the expected format
    const order: Order = {
      id: orderData.id,
      userId: orderData.user_id,
      orderNumber: orderData.order_number,
      items: orderItems.map((item, index) => ({
        id: `temp-${index}`,
        orderId: orderData.id,
        productId: item.product_id,
        productName: item.product_name,
        productImage: item.product_image,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
      })),
      shippingAddress: input.shippingAddress,
      subtotal: input.subtotal,
      shipping: input.shipping,
      tax: input.tax,
      total: input.total,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: input.paymentMethod,
      paymentReference: input.paymentReference,
      notes: input.notes,
      createdAt: orderData.created_at,
      updatedAt: orderData.updated_at,
    }

    return { success: true, order }
  } catch (error) {
    console.error('Unexpected error creating order:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getOrderByReference(reference: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('payment_reference', reference)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return mapOrder(data)
}

export async function getUserOrders(): Promise<Order[]> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user orders:', error)
    return []
  }

  return data.map(mapOrder)
}

function mapOrder(data: Record<string, unknown>): Order {
  const items = (data.order_items as Record<string, unknown>[] || []).map(item => ({
    id: item.id as string,
    orderId: item.order_id as string,
    productId: item.product_id as string,
    productName: item.product_name as string,
    productImage: item.product_image as string,
    quantity: Number(item.quantity),
    price: Number(item.price),
    size: item.size as string | undefined,
    color: item.color as string | undefined,
  }))

  return {
    id: data.id as string,
    userId: data.user_id as string,
    orderNumber: data.order_number as string,
    items,
    shippingAddress: data.shipping_address as Order['shippingAddress'],
    billingAddress: data.billing_address as Order['billingAddress'],
    subtotal: Number(data.subtotal),
    shipping: Number(data.shipping),
    tax: Number(data.tax),
    total: Number(data.total),
    status: data.status as Order['status'],
    paymentStatus: data.payment_status as Order['paymentStatus'],
    paymentMethod: data.payment_method as string,
    paymentReference: data.payment_reference as string | undefined,
    notes: data.notes as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  }
}
