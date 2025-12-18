import { useState } from 'react'
import { format } from 'date-fns'
import {
  Star,
  Trash2,
  MoreHorizontal,
  Eye,
  User,
  Calendar,
  Package,
  CheckCircle,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { AdminReview } from '@/services/review.service'

interface ReviewsTableProps {
  reviews: AdminReview[]
  loading: boolean
  onDelete: (id: string) => void
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-muted text-muted'
          }`}
        />
      ))}
    </div>
  )
}

export function ReviewsTable({
  reviews,
  loading,
  onDelete,
}: ReviewsTableProps) {
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const handleView = (review: AdminReview) => {
    setSelectedReview(review)
    setViewDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No reviews yet</h3>
        <p className="text-muted-foreground">
          Product reviews will appear here.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {review.productImage ? (
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <span className="font-medium line-clamp-1 max-w-[150px]">
                      {review.productName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{review.userFullName}</span>
                    {review.isVerifiedPurchase && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StarRating rating={review.rating} />
                </TableCell>
                <TableCell>
                  <span className="line-clamp-1 max-w-[200px]">
                    {review.title || review.comment || 'No content'}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(review.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(review)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(review.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedReview && (
            <>
              <DialogHeader>
                <DialogTitle>Review Details</DialogTitle>
                <DialogDescription>
                  Review for {selectedReview.productName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {selectedReview.productImage ? (
                    <img
                      src={selectedReview.productImage}
                      alt={selectedReview.productName}
                      className="h-16 w-16 rounded object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{selectedReview.productName}</h3>
                    <StarRating rating={selectedReview.rating} />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedReview.userFullName}</span>
                    {selectedReview.isVerifiedPurchase && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <CheckCircle className="h-3 w-3" />
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(selectedReview.createdAt), 'PPpp')}
                    </span>
                  </div>
                </div>

                {selectedReview.title && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Title</h4>
                    <p className="font-medium">{selectedReview.title}</p>
                  </div>
                )}

                {selectedReview.comment && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Comment</h4>
                    <p className="whitespace-pre-wrap">{selectedReview.comment}</p>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onDelete(selectedReview.id)
                      setViewDialogOpen(false)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Review
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ReviewsTable
