import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CheckoutForm, OrderSummary } from '@/components/checkout'
import { useCart } from '@/hooks/useCart'
import { ROUTES } from '@/constants/routes'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart } = useCart()

  useEffect(() => {
    if (items.length === 0) {
      navigate(ROUTES.CART)
    }
  }, [items.length, navigate])

  const handlePaymentSuccess = (reference: string) => {
    clearCart()
    navigate(`/order-success?ref=${reference}`)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before checking out.
          </p>
          <Button asChild size="lg">
            <Link to={ROUTES.SHOP}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="flex items-center gap-2 sm:gap-4 mb-6 md:mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link to={ROUTES.CART}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Complete your order</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm onSuccess={handlePaymentSuccess} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <OrderSummary />
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span className="font-medium">Secure Checkout</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 256-bit SSL encryption</li>
                <li>• Secure payment processing</li>
                <li>• Your data is protected</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
