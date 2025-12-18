import { Star, CheckCircle, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Review } from '@/services/review.service'

interface ReviewListProps {
  reviews: Review[]
  currentUserId?: string
  onEdit?: (review: Review) => void
  onDelete?: (reviewId: string) => void
}

export function ReviewList({ reviews, currentUserId, onEdit, onDelete }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const isOwn = currentUserId && review.userId === currentUserId
        
        return (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-4 w-4',
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  {review.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle className="h-3 w-3" />
                      Verified Purchase
                    </span>
                  )}
                </div>
                
                {review.title && (
                  <h4 className="font-semibold text-foreground">{review.title}</h4>
                )}
                
                <p className="text-sm text-muted-foreground">
                  by <span className="font-medium">{review.userFullName}</span> on {formatDate(review.createdAt)}
                </p>
              </div>

              {isOwn && (
                <div className="flex gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(review)}
                      className="h-8 px-2"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(review.id)}
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {review.comment && (
              <p className="mt-3 text-foreground leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
