import { supabase } from './supabase'

export interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  title: string | null
  comment: string | null
  isVerifiedPurchase: boolean
  isApproved: boolean
  createdAt: string
  updatedAt: string
  userFullName?: string
}

export interface CreateReviewInput {
  productId: string
  rating: number
  title?: string
  comment?: string
}

export interface UpdateReviewInput {
  rating?: number
  title?: string
  comment?: string
}

export interface ProductRating {
  averageRating: number
  reviewCount: number
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('product_reviews')
    .select(`
      *,
      profiles:user_id (full_name)
    `)
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data.map((review) => ({
    id: review.id,
    productId: review.product_id,
    userId: review.user_id,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    isVerifiedPurchase: review.is_verified_purchase,
    isApproved: review.is_approved,
    createdAt: review.created_at,
    updatedAt: review.updated_at,
    userFullName: review.profiles?.full_name || 'Anonymous',
  }))
}

export async function getProductRating(productId: string): Promise<ProductRating> {
  const { data, error } = await supabase
    .rpc('get_product_rating', { p_product_id: productId })

  if (error || !data || data.length === 0) {
    return { averageRating: 0, reviewCount: 0 }
  }

  return {
    averageRating: Number(data[0].average_rating) || 0,
    reviewCount: data[0].review_count || 0,
  }
}

export async function getUserReviewForProduct(productId: string, userId: string): Promise<Review | null> {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    productId: data.product_id,
    userId: data.user_id,
    rating: data.rating,
    title: data.title,
    comment: data.comment,
    isVerifiedPurchase: data.is_verified_purchase,
    isApproved: data.is_approved,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function createReview(input: CreateReviewInput): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in to submit a review' }
  }

  const { error } = await supabase
    .from('product_reviews')
    .insert({
      product_id: input.productId,
      user_id: user.id,
      rating: input.rating,
      title: input.title || null,
      comment: input.comment || null,
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'You have already reviewed this product' }
    }
    console.error('Error creating review:', error)
    return { error: 'Failed to submit review' }
  }

  return { error: null }
}

export async function updateReview(reviewId: string, input: UpdateReviewInput): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('product_reviews')
    .update({
      rating: input.rating,
      title: input.title,
      comment: input.comment,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId)

  if (error) {
    console.error('Error updating review:', error)
    return { error: 'Failed to update review' }
  }

  return { error: null }
}

export async function deleteReview(reviewId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('product_reviews')
    .delete()
    .eq('id', reviewId)

  if (error) {
    console.error('Error deleting review:', error)
    return { error: 'Failed to delete review' }
  }

  return { error: null }
}
