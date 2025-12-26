import { supabase } from './supabase'
import type { Product, ProductVariant, VariantFormData } from '@/types/product'
import type { Order, OrderStatus, PaymentStatus } from '@/types/order'
import type { UserProfile, UserRole } from '@/types/user'

// ============================================
// DASHBOARD STATS
// ============================================

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  recentOrders: Order[]
  lowStockProducts: Product[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [ordersResult, customersResult, productsResult, lowStockResult] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id').eq('role', 'customer'),
    supabase.from('products').select('*').eq('is_active', true),
    supabase.from('products').select('*').lt('stock', 10).eq('is_active', true),
  ])

  const orders = ordersResult.data || []
  const totalRevenue = orders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.total), 0)

  return {
    totalRevenue,
    totalOrders: orders.length,
    totalCustomers: customersResult.data?.length || 0,
    totalProducts: productsResult.data?.length || 0,
    recentOrders: orders.slice(0, 5).map(mapOrder),
    lowStockProducts: (lowStockResult.data || []).map(mapProduct),
  }
}

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data.map(mapProduct)
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  const product = mapProduct(data)

  // Fetch variants for the product
  const { data: variantsData } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', id)
    .eq('is_active', true)
    .order('size', { ascending: true })

  if (variantsData && variantsData.length > 0) {
    product.variants = variantsData.map(mapVariant)
    product.hasVariants = true
  }

  return product
}

interface CreateProductInput extends Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'variants'> {
  hasVariants?: boolean
  variants?: VariantFormData[]
}

export async function createProduct(
  product: CreateProductInput
): Promise<{ data: Product | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.name,
      description: product.description,
      price: product.price,
      compare_at_price: product.compareAtPrice,
      category: product.category,
      subcategory: product.subcategory,
      images: product.images,
      thumbnail: product.thumbnail,
      stock: product.stock,
      sku: product.sku,
      featured: product.featured,
      author: product.author,
      size: product.size,
      color: product.color,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  const createdProduct = mapProduct(data)

  // Create variants if provided (check variants array - if variants exist, hasVariants should be true)
  if (product.variants && product.variants.length > 0) {
    // Filter out invalid variants (must have size and color)
    const validVariants = product.variants.filter(v => v.size && v.color)
    
    if (validVariants.length === 0) {
      return { 
        data: createdProduct, 
        error: new Error('Variants must have both size and color specified') 
      }
    }

    const variantsToInsert = validVariants.map(v => ({
      product_id: createdProduct.id,
      size: v.size,
      color: v.color,
      stock: v.stock || 0,
      sku_suffix: v.skuSuffix || null,
      price_adjustment: v.priceAdjustment || 0,
      is_active: true,
    }))

    const { error: variantError } = await supabase
      .from('product_variants')
      .insert(variantsToInsert)

    if (variantError) {
      console.error('Error creating variants:', variantError)
      // Return error so user knows variants weren't saved
      return { 
        data: createdProduct, 
        error: new Error(`Product created but variants failed to save: ${variantError.message}`) 
      }
    } else {
      createdProduct.hasVariants = true
      createdProduct.variants = product.variants.map((v) => ({
        id: '',
        productId: createdProduct.id,
        size: v.size,
        color: v.color,
        stock: v.stock,
        skuSuffix: v.skuSuffix,
        priceAdjustment: v.priceAdjustment,
        isActive: true,
      }))
    }
  }

  return { data: createdProduct, error: null }
}

interface UpdateProductInput extends Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'variants'>> {
  hasVariants?: boolean
  variants?: VariantFormData[]
}

export async function updateProduct(
  id: string,
  updates: UpdateProductInput
): Promise<{ error: Error | null }> {
  const updateData: Record<string, unknown> = {}
  
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.price !== undefined) updateData.price = updates.price
  if (updates.compareAtPrice !== undefined) updateData.compare_at_price = updates.compareAtPrice
  if (updates.category !== undefined) updateData.category = updates.category
  if (updates.subcategory !== undefined) updateData.subcategory = updates.subcategory
  if (updates.images !== undefined) updateData.images = updates.images
  if (updates.thumbnail !== undefined) updateData.thumbnail = updates.thumbnail
  if (updates.stock !== undefined) updateData.stock = updates.stock
  if (updates.sku !== undefined) updateData.sku = updates.sku
  if (updates.featured !== undefined) updateData.featured = updates.featured
  if (updates.author !== undefined) updateData.author = updates.author
  if (updates.size !== undefined) updateData.size = updates.size
  if (updates.color !== undefined) updateData.color = updates.color

  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return { error: new Error(error.message) }
  }

  // Handle variants update
  // Process variants if they're provided, or if hasVariants is explicitly set to false (to remove them)
  // Also process if variants array exists (even if hasVariants flag is not set)
  if (updates.variants !== undefined || updates.hasVariants !== undefined) {
    if (updates.hasVariants === false || (updates.variants !== undefined && (!updates.variants || updates.variants.length === 0))) {
      // Remove all variants if hasVariants is false or variants array is empty
      const { error: deleteError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', id)

      if (deleteError) {
        console.error('Error deleting variants:', deleteError)
        return { error: new Error(`Failed to remove variants: ${deleteError.message}`) }
      }
    } else if (updates.variants && updates.variants.length > 0) {
      // Filter out invalid variants (must have size and color)
      const validVariants = updates.variants.filter(v => v.size && v.color)
      
      if (validVariants.length === 0) {
        return { error: new Error('Variants must have both size and color specified') }
      }

      // Delete existing variants and insert new ones
      const { error: deleteError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', id)

      if (deleteError) {
        console.error('Error deleting existing variants:', deleteError)
        return { error: new Error(`Failed to update variants: ${deleteError.message}`) }
      }

      const variantsToInsert = validVariants.map(v => ({
        product_id: id,
        size: v.size,
        color: v.color,
        stock: v.stock || 0,
        sku_suffix: v.skuSuffix || null,
        price_adjustment: v.priceAdjustment || 0,
        is_active: true,
      }))

      const { error: variantError } = await supabase
        .from('product_variants')
        .insert(variantsToInsert)

      if (variantError) {
        console.error('Error inserting variants:', variantError)
        return { error: new Error(`Failed to save variants: ${variantError.message}`) }
      }
    }
  }

  return { error: null }
}

export async function deleteProduct(id: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id)

  return { error: error ? new Error(error.message) : null }
}

// ============================================
// ORDERS MANAGEMENT
// ============================================

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return data.map(mapOrder)
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return mapOrder(data)
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  return { error: error ? new Error(error.message) : null }
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: PaymentStatus
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: paymentStatus })
    .eq('id', id)

  return { error: error ? new Error(error.message) : null }
}

// ============================================
// CUSTOMERS MANAGEMENT
// ============================================

export interface CustomerWithOrders extends UserProfile {
  email: string
  orderCount: number
  totalSpent: number
}

export async function getCustomers(): Promise<CustomerWithOrders[]> {
  // Fetch all profiles with their emails
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customers:', error)
    return []
  }

  if (!profiles || profiles.length === 0) {
    return []
  }

  // Get order stats for each customer
  const customerIds = profiles.map(p => p.id)
  const { data: orders } = await supabase
    .from('orders')
    .select('user_id, total, payment_status')
    .in('user_id', customerIds)

  const orderStats = new Map<string, { count: number; spent: number }>()
  orders?.forEach(order => {
    const stats = orderStats.get(order.user_id) || { count: 0, spent: 0 }
    stats.count += 1
    if (order.payment_status === 'paid') {
      stats.spent += Number(order.total)
    }
    orderStats.set(order.user_id, stats)
  })

  return profiles.map(profile => {
    const stats = orderStats.get(profile.id) || { count: 0, spent: 0 }
    return {
      id: profile.id,
      fullName: profile.full_name || 'Unknown User',
      avatarUrl: profile.avatar_url,
      phone: profile.phone,
      role: profile.role || 'customer',
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      email: profile.email || '',
      orderCount: stats.count,
      totalSpent: stats.spent,
    }
  })
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  return { error: error ? new Error(error.message) : null }
}

// ============================================
// HELPER MAPPERS
// ============================================

function mapProduct(data: Record<string, unknown>): Product {
  return {
    id: data.id as string,
    name: data.name as string,
    description: data.description as string,
    price: Number(data.price),
    compareAtPrice: data.compare_at_price ? Number(data.compare_at_price) : undefined,
    category: data.category as 'books' | 'apparel' | 'accessories',
    subcategory: data.subcategory as string | undefined,
    images: (data.images as string[]) || [],
    thumbnail: data.thumbnail as string,
    stock: Number(data.stock),
    sku: data.sku as string,
    featured: Boolean(data.featured),
    author: data.author as string | undefined,
    size: data.size as string | undefined,
    color: data.color as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  }
}

function mapVariant(data: Record<string, unknown>): ProductVariant {
  return {
    id: data.id as string,
    productId: data.product_id as string,
    size: data.size as string,
    color: data.color as string,
    stock: Number(data.stock),
    skuSuffix: data.sku_suffix as string | undefined,
    priceAdjustment: data.price_adjustment ? Number(data.price_adjustment) : undefined,
    isActive: Boolean(data.is_active),
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  }
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
    status: data.status as OrderStatus,
    paymentStatus: data.payment_status as PaymentStatus,
    paymentMethod: data.payment_method as string,
    paymentReference: data.payment_reference as string | undefined,
    notes: data.notes as string | undefined,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  }
}
