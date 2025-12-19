import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuantitySelector } from './QuantitySelector'
import type { CartItem as CartItemType } from '@/types/cart'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity, selectedSize, selectedColor } = item

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4 border-b last:border-b-0">
      <div className="w-full sm:w-24 h-48 sm:h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={product.thumbnail || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground line-clamp-2 sm:truncate">{product.name}</h3>
        {(selectedSize || selectedColor) && (
          <p className="text-sm text-muted-foreground mt-1">
            {selectedSize && <span>Size: {selectedSize}</span>}
            {selectedSize && selectedColor && <span> / </span>}
            {selectedColor && <span>Color: {selectedColor}</span>}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          {formatPrice(product.price)} each
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => onUpdateQuantity(quantity + 1)}
            onDecrease={() => onUpdateQuantity(quantity - 1)}
            max={product.stock}
          />
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <p className="font-semibold sm:hidden">{formatPrice(product.price * quantity)}</p>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden sm:block text-right">
        <p className="font-semibold">{formatPrice(product.price * quantity)}</p>
      </div>
    </div>
  )
}
