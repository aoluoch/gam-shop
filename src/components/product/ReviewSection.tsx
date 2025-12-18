import { useState, useEffect, useCallback } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { ReviewForm } from './ReviewForm'
import { ReviewList } from './ReviewList'
import {
  getProductReviews,
  getProductRating,
  getUserReviewForProduct,
  deleteReview,
  type Review,
  type ProductRating,
} from '@/services/review.service'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'

interface ReviewSectionProps {
  productId: string
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState<ProductRating>({ averageRating: 0, reviewCount: 0 })
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  const loadReviews = useCallback(async () => {
    setLoading(true)
    try {
      const [reviewsData, ratingData] = await Promise.all([
        getProductReviews(productId),
        getProductRating(productId),
      ])
      setReviews(reviewsData)
      setRating(ratingData)

      if (user) {
        const existingReview = await getUserReviewForProduct(productId, user.id)
        setUserReview(existingReview)
      }
    } catch (err) {
      console.error('Error loading reviews:', err)
    } finally {
      setLoading(false)
    }
  }, [productId, user])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const handleReviewSuccess = () => {
    setShowForm(false)
    setEditingReview(null)
    loadReviews()
    success(editingReview ? 'Review updated successfully' : 'Review submitted successfully')
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setShowForm(true)
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return

    const result = await deleteReview(reviewId)
    if (result.error) {
      showError(result.error)
    } else {
      success('Review deleted successfully')
      loadReviews()
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingReview(null)
  }

  const canWriteReview = user && !userReview && !showForm
  const canEditReview = user && userReview && !showForm

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Reviews
          </CardTitle>
          
          <div className="flex items-center gap-4">
            {rating.reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'h-5 w-5',
                        star <= Math.round(rating.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="font-semibold">{rating.averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({rating.reviewCount} review{rating.reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
            )}
            
            {canWriteReview && (
              <Button onClick={() => setShowForm(true)}>
                Write a Review
              </Button>
            )}
            
            {canEditReview && (
              <Button variant="outline" onClick={() => handleEdit(userReview)}>
                Edit Your Review
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {!user && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-center">
                <p className="text-muted-foreground">
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                  {' '}to write a review
                </p>
              </div>
            )}

            {showForm && user && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-semibold mb-4">
                  {editingReview ? 'Edit Your Review' : 'Write a Review'}
                </h3>
                <ReviewForm
                  productId={productId}
                  existingReview={editingReview}
                  onSuccess={handleReviewSuccess}
                  onCancel={handleCancel}
                />
              </div>
            )}

            <ReviewList
              reviews={reviews}
              currentUserId={user?.id}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
