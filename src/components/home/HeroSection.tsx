import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Shirt, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Spiritual Resources for Your{' '}
              <span className="text-primary">Journey</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Discover inspiring books by Apostle David Owusu and Rev. Eunice, 
              quality apparel, and accessories that reflect your faith.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to={ROUTES.SHOP}>
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to={ROUTES.BOOKS}>Browse Books</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              to={ROUTES.BOOKS}
              className="group p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow"
            >
              <BookOpen className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Books</h3>
              <p className="text-sm text-muted-foreground">
                Spiritual wisdom and teachings
              </p>
            </Link>
            <Link
              to={ROUTES.APPAREL}
              className="group p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow"
            >
              <Shirt className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Apparel</h3>
              <p className="text-sm text-muted-foreground">
                T-shirts in various styles
              </p>
            </Link>
            <Link
              to={ROUTES.ACCESSORIES}
              className="group p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow col-span-2"
            >
              <Gift className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Accessories</h3>
              <p className="text-sm text-muted-foreground">
                Caps, rubber bands, and more
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
