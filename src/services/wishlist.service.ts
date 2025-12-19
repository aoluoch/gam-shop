import { supabase } from './supabase'
import type { Product } from '@/types/product'

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: string
}

export async function getWishlistItems(): Promise<WishlistItem[]> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('wishlist_items')
    .select(`
      id,
      user_id,
      product_id,
      created_at,
      products (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching wishlist:', error)
    return []
  }

  return (data || []).map(item => ({
    id: item.id,
    userId: item.user_id,
    productId: item.product_id,
    createdAt: item.created_at,
    product: mapProduct(item.products as unknown as Record<string, unknown>),
  }))
}

export async function addToWishlist(productId: string): Promise<{ error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: new Error('You must be logged in to add items to your wishlist') }
  }

  const { error } = await supabase
    .from('wishlist_items')
    .insert({
      user_id: user.id,
      product_id: productId,
    })

  if (error) {
    if (error.code === '23505') {
      return { error: new Error('This item is already in your wishlist') }
    }
    return { error: new Error(error.message) }
  }

  return { error: null }
}

export async function removeFromWishlist(wishlistItemId: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('id', wishlistItemId)

  if (error) {
    return { error: new Error(error.message) }
  }

  return { error: null }
}

export async function isInWishlist(productId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  if (error) {
    console.error('Error checking wishlist:', error)
    return false
  }

  return !!data
}

export async function moveToCart(wishlistItemId: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.rpc('move_to_cart', {
    p_wishlist_item_id: wishlistItemId,
  })

  if (error) {
    return { error: new Error(error.message) }
  }

  return { error: null }
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
