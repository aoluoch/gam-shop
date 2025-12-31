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
    console.log('createOrder called with input:', input)
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('Current user:', user?.id, 'Error:', userError)
    
    if (userError || !user) {
      console.error('User authentication failed:', userError)
      return { success: false, error: 'User not authenticated' }
    }

    // Check if order with this payment reference already exists (idempotent operation)
    // This prevents duplicate orders if payment callback is called multiple times
    if (input.paymentReference) {
      console.log('Checking for existing order with payment reference:', input.paymentReference)
      const existingOrder = await getOrderByReference(input.paymentReference)
      if (existingOrder) {
        console.log('Order already exists with this payment reference, returning existing order')
        return { success: true, order: existingOrder }
      }
    }

    // Use atomic order creation with built-in retry logic
    // The database function handles duplicate key violations internally
    console.log('Creating order atomically with auto-generated order number...')
    
    const { data: orderResult, error: orderCreationError } = await supabase
      .rpc('create_order_with_number', {
        p_user_id: user.id,
        p_subtotal: input.subtotal,
        p_shipping: input.shipping,
        p_tax: input.tax,
        p_total: input.total,
        p_status: 'processing',
        p_payment_status: 'paid',
        p_payment_method: input.paymentMethod,
        p_payment_reference: input.paymentReference,
        p_notes: input.notes,
        p_shipping_address: input.shippingAddress,
      })

    console.log('Atomic order creation result:', orderResult, 'error:', orderCreationError)

    let orderData = null

    if (orderCreationError || !orderResult || orderResult.length === 0) {
      console.error('Error creating order atomically:', orderCreationError)
      // Fallback: try using generate_order_number directly with retry logic
      console.log('Falling back to manual order creation with retry...')
      const fallbackResult = await createOrderWithRetry(input, user.id)
      if (!fallbackResult.success || !fallbackResult.order) {
        return fallbackResult
      }
      // Fetch the complete order data for fallback path
      const { data: fetchedOrder, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', fallbackResult.order.id)
        .single()
      
      if (fetchError || !fetchedOrder) {
        console.error('Error fetching fallback order:', fetchError)
        return { success: false, error: 'Order created but failed to retrieve order data' }
      }
      orderData = fetchedOrder
    } else {
      const createdOrder = orderResult[0]
      const orderId = createdOrder.id

      // Fetch the complete order data
      const { data: fetchedOrder, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (fetchError || !fetchedOrder) {
        console.error('Error fetching created order:', fetchError)
        return { success: false, error: 'Order created but failed to retrieve order data' }
      }
      orderData = fetchedOrder
    }

    // Create order items
    const orderItemsData = input.items.map(item => ({
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
      .insert(orderItemsData)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Order was created but items failed - this is a partial failure
      // In production, you'd want to handle this with a transaction
    }

    // Update product stock - check availability and handle out-of-stock scenarios
    const stockUpdateErrors: string[] = []
    for (const item of input.items) {
      // Check if product has variants (size and color selected)
      const hasVariants = item.selectedSize && item.selectedColor

      if (hasVariants) {
        // For products with variants, update variant stock
        const { data: variantData, error: variantFetchError } = await supabase
          .from('product_variants')
          .select('stock, id')
          .eq('product_id', item.product.id)
          .eq('size', item.selectedSize)
          .eq('color', item.selectedColor)
          .eq('is_active', true)
          .single()

        if (variantFetchError || !variantData) {
          stockUpdateErrors.push(
            `Failed to find variant for ${item.product.name} (${item.selectedSize}, ${item.selectedColor})`
          )
          console.error('Error fetching variant stock:', item.product.id, variantFetchError)
          continue
        }

        const variantStock = Number(variantData.stock)
        if (variantStock < item.quantity) {
          stockUpdateErrors.push(
            `${item.product.name} (${item.selectedSize}, ${item.selectedColor}) is out of stock. Available: ${variantStock}, Requested: ${item.quantity}`
          )
          continue
        }

        // Update variant stock atomically
        const { error: variantStockError } = await supabase
          .from('product_variants')
          .update({ stock: variantStock - item.quantity })
          .eq('id', variantData.id)
          .gte('stock', item.quantity) // Ensure stock is still >= quantity (race condition protection)

        if (variantStockError) {
          stockUpdateErrors.push(
            `Failed to update variant stock for ${item.product.name} (${item.selectedSize}, ${item.selectedColor})`
          )
          console.error('Error updating variant stock:', variantData.id, variantStockError)
        }
      } else {
        // For products without variants, update main product stock
        const { data: currentProduct, error: fetchError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product.id)
          .single()

        if (fetchError || !currentProduct) {
          stockUpdateErrors.push(`Failed to verify stock for ${item.product.name}`)
          console.error('Error fetching product stock:', item.product.id, fetchError)
          continue
        }

        const currentStock = Number(currentProduct.stock)
        if (currentStock < item.quantity) {
          stockUpdateErrors.push(
            `${item.product.name} is out of stock. Available: ${currentStock}, Requested: ${item.quantity}`
          )
          continue
        }

        // Update stock atomically - only if sufficient stock exists
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: currentStock - item.quantity })
          .eq('id', item.product.id)
          .gte('stock', item.quantity) // Ensure stock is still >= quantity (race condition protection)

        if (stockError) {
          stockUpdateErrors.push(`Failed to update stock for ${item.product.name}`)
          console.error('Error updating stock for product:', item.product.id, stockError)
        }
      }
    }

    // If any stock updates failed, return error
    if (stockUpdateErrors.length > 0) {
      console.error('Stock update errors:', stockUpdateErrors)
      return { 
        success: false, 
        error: `Stock update failed: ${stockUpdateErrors.join('; ')}` 
      }
    }

    // Map the order to the expected format
    const order: Order = {
      id: orderData.id,
      userId: orderData.user_id,
      orderNumber: orderData.order_number,
      items: orderItemsData.map((item, index) => ({
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

// Fallback function for manual order creation with retry logic
async function createOrderWithRetry(input: CreateOrderInput, userId: string): Promise<CreateOrderResult> {
  const maxRetries = 10
  let orderData = null
  let orderError = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Generate order number
    const { data: orderNumberData, error: orderNumberError } = await supabase
      .rpc('generate_order_number')

    if (orderNumberError) {
      console.error('Error generating order number:', orderNumberError)
      return { success: false, error: 'Failed to generate order number' }
    }

    const orderNumber = orderNumberData as string

    // Try to create the order
    const { data: insertedOrderData, error: insertedOrderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        subtotal: input.subtotal,
        shipping: input.shipping,
        tax: input.tax,
        total: input.total,
        status: 'processing',
        payment_status: 'paid',
        payment_method: input.paymentMethod,
        payment_reference: input.paymentReference,
        notes: input.notes,
        shipping_address: input.shippingAddress,
      })
      .select()
      .single()

    if (insertedOrderError) {
      const errorMessage = (insertedOrderError.message || '').toLowerCase()
      const errorCode = insertedOrderError.code || ''
      const isDuplicateKey = 
        errorCode === '23505' ||
        errorMessage.includes('duplicate key') ||
        errorMessage.includes('unique constraint') ||
        errorMessage.includes('orders_order_number_key')

      if (isDuplicateKey && attempt < maxRetries - 1) {
        console.warn(`Duplicate detected (attempt ${attempt + 1}), retrying...`)
        await new Promise(resolve => setTimeout(resolve, 50 * (attempt + 1)))
        continue
      } else {
        orderError = insertedOrderError
        break
      }
    } else {
      orderData = insertedOrderData
      break
    }
  }

  if (orderError || !orderData) {
    return { success: false, error: `Failed to create order: ${orderError?.message || 'Unknown error'}` }
  }

  // Fetch complete order data
  const { data: completeOrder, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderData.id)
    .single()

  if (fetchError || !completeOrder) {
    return { success: false, error: 'Order created but failed to retrieve order data' }
  }

  return { success: true, order: mapOrder({ ...completeOrder, order_items: [] }) }
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

export async function getUserOrderById(orderId: string): Promise<Order | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return mapOrder(data)
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
