import { useEffect, useState, useCallback } from 'react'
import { ReviewsTable } from '@/components/admin/ReviewsTable'
import { getAllReviews, adminDeleteReview } from '@/services/review.service'
import type { AdminReview } from '@/services/review.service'
import { useToast } from '@/hooks/useToast'

export function ReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useToast()

  const loadReviews = useCallback(async () => {
    try {
      const data = await getAllReviews()
      setReviews(data)
    } catch (error) {
      console.error('Error loading reviews:', error)
      showError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return
    }
    
    try {
      const { error } = await adminDeleteReview(id)
      if (error) {
        showError(error)
        return
      }
      setReviews(reviews.filter((r) => r.id !== id))
      success('Review deleted successfully')
    } catch (error) {
      console.error('Error deleting review:', error)
      showError('Failed to delete review')
    }
  }

  const totalReviews = reviews.length
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Product Reviews</h1>
        <p className="text-muted-foreground">
          Manage customer reviews across all products
          {totalReviews > 0 && (
            <span className="ml-2">
              ({totalReviews} reviews, {averageRating} avg rating)
            </span>
          )}
        </p>
      </div>

      <ReviewsTable
        reviews={reviews}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  )
}
