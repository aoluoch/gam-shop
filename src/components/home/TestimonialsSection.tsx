import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Grace M.',
    location: 'Nairobi, Kenya',
    rating: 5,
    text: 'The books from GAM Shop have transformed my spiritual journey. The teachings are profound and practical.',
  },
  {
    name: 'John K.',
    location: 'Mombasa, Kenya',
    rating: 5,
    text: 'Fast delivery and excellent quality t-shirts. I love wearing them to church events!',
  },
  {
    name: 'Sarah O.',
    location: 'Kisumu, Kenya',
    rating: 5,
    text: 'Amazing customer service and the products exceeded my expectations. Highly recommend!',
  },
]

export function TestimonialsSection() {
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
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">{testimonial.text}</p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
