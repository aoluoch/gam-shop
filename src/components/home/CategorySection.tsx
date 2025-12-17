import { Link } from 'react-router-dom'
import { BookOpen, Shirt, Gift, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/constants/routes'

const categories = [
  {
    name: 'Books',
    description: 'Spiritual books and teachings by Apostle David Owusu and Rev. Eunice',
    icon: BookOpen,
    href: ROUTES.BOOKS,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    name: 'Apparel',
    description: 'Quality t-shirts in various sizes and colors',
    icon: Shirt,
    href: ROUTES.APPAREL,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    name: 'Accessories',
    description: 'Caps, rubber bands, and other faith-inspired accessories',
    icon: Gift,
    href: ROUTES.ACCESSORIES,
    color: 'bg-amber-50 text-amber-600',
  },
]

export function CategorySection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Shop by Category</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse our collection of spiritual resources, apparel, and accessories
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative p-8 bg-card rounded-xl border shadow-sm hover:shadow-lg transition-all"
            >
              <div className={`inline-flex p-3 rounded-lg ${category.color} mb-4`}>
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
              <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                Shop Now
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
