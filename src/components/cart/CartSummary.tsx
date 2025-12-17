import { useCart } from '@/hooks/useCart'

interface CartSummaryProps {
  showDetails?: boolean
}

export function CartSummary({ showDetails = true }: CartSummaryProps) {
  const { subtotal, shipping, tax, total, itemCount } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-3">
      {showDetails && (
        <>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VAT (16%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          {shipping === 0 && subtotal > 0 && (
            <p className="text-xs text-green-600">
              🎉 You qualify for free shipping!
            </p>
          )}
          {shipping > 0 && (
            <p className="text-xs text-muted-foreground">
              Add {formatPrice(5000 - subtotal)} more for free shipping
            </p>
          )}
          <hr className="my-2" />
        </>
      )}
      <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  )
}
