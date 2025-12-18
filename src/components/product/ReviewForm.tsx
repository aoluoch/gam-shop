import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { createReview, updateReview, type Review, type CreateReviewInput } from '@/services/review.service'

interface ReviewFormProps {
  productId: string
  existingReview?: Review | null
  onSuccess: () => void
  onCancel?: () => void
}

export function ReviewForm({ productId, existingReview, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState(existingReview?.title || '')
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!existingReview

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setLoading(true)

    try {
      let result
      if (isEditing && existingReview) {
        result = await updateReview(existingReview.id, {
          rating,
          title: title.trim() || undefined,
          comment: comment.trim() || undefined,
        })
      } else {
        const input: CreateReviewInput = {
          productId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim() || undefined,
        }
        result = await createReview(input)
      }

      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Rating *</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              <Star
                className={cn(
                  'h-6 w-6 transition-colors',
                  (hoveredRating || rating) >= star
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground self-center">
            {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-title">Title (optional)</Label>
        <Input
          id="review-title"
          placeholder="Summarize your review"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-comment">Review (optional)</Label>
        <Textarea
          id="review-comment"
          placeholder="Share your experience with this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground text-right">
          {comment.length}/1000
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
