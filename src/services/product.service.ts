import { supabase } from './supabase'
import type { Product } from '@/types/product'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data.map(mapProduct)
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return data.map(mapProduct)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products by category:', error)
    return []
  }

  return data.map(mapProduct)
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
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

function mapVariant(data: Record<string, unknown>) {
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
