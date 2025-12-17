import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, Package, Mail, ArrowRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('ref') || 'N/A'

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Order Reference</p>
                <p className="font-mono font-semibold">{reference}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(reference)}>
                Copy
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Email Confirmation</p>
                  <p className="text-xs text-muted-foreground">
                    A confirmation email with your order details has been sent to your email address.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Shipping Updates</p>
                  <p className="text-xs text-muted-foreground">
                    You'll receive shipping updates via email as your order progresses.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">What's Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  <span>We're preparing your order for shipment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  <span>You'll receive tracking information once shipped</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  <span>Estimated delivery: 3-7 business days</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to={ROUTES.ORDERS}>
              <Package className="mr-2 h-4 w-4" />
              View Orders
            </Link>
          </Button>
          <Button asChild>
            <Link to={ROUTES.SHOP}>
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-center">
          <Button variant="ghost" asChild>
            <Link to={ROUTES.HOME}>
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
