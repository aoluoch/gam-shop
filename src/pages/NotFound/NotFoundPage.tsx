import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export function NotFoundPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">404</p>
        <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mb-8 text-muted-foreground">
          The page may have moved, or the link may no longer be available. You can return home or browse the shop.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link to={ROUTES.HOME}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.SHOP}>
              <Search className="mr-2 h-4 w-4" />
              Browse Shop
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to={ROUTES.CONTACT}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
