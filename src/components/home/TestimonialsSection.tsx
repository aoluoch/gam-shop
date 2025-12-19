import { useEffect, useState } from 'react'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getLatestReviews } from '@/services/review.service'
import type { Review } from '@/services/review.service'

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLatestReviews(3).then((data) => {
      setReviews(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Read testimonials from our satisfied customers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 md:mb-3">What Our Customers Say</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Read testimonials from our satisfied customers
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="relative">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  {review.title && <span className="font-medium">{review.title} - </span>}
                  {review.comment || 'Great product!'}
                </p>
                <div>
                  <p className="font-medium">{review.userFullName}</p>
                  {review.isVerifiedPurchase && (
                    <p className="text-sm text-primary">Verified Purchase</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
