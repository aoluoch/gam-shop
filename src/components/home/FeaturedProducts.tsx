import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product'
import { SAMPLE_PRODUCTS } from '@/constants/products'
import { ROUTES } from '@/constants/routes'

export function FeaturedProducts() {
  const featuredProducts = SAMPLE_PRODUCTS.filter(p => p.featured).slice(0, 4)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
            <p className="text-muted-foreground mt-1">Our most popular items</p>
          </div>
          <Button variant="outline" asChild>
            <Link to={ROUTES.SHOP}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
