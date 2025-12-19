import { useState, useEffect, useCallback } from 'react'
import { ShoppingCart, Heart, Eye, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/services/wishlist.service'
import { supabase } from '@/services/supabase'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart()
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const navigate = useNavigate()
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)

  const checkWishlistStatus = useCallback(async () => {
    const inList = await isInWishlist(product.id)
    setInWishlist(inList)
    if (inList) {
      // Get the wishlist item ID for removal
      const { data } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('product_id', product.id)
        .maybeSingle()
      if (data) {
        setWishlistItemId(data.id)
      }
    }
  }, [product.id])

  useEffect(() => {
    if (user) {
      checkWishlistStatus()
    } else {
      setInWishlist(false)
      setWishlistItemId(null)
    }
  }, [user, product.id, checkWishlistStatus])

  async function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      showError('Please login to add items to your wishlist')
      navigate('/login')
      return
    }

    setWishlistLoading(true)
    try {
      if (inWishlist && wishlistItemId) {
        const { error } = await removeFromWishlist(wishlistItemId)
        if (error) {
          showError(error.message)
        } else {
          setInWishlist(false)
          setWishlistItemId(null)
          success('Removed from wishlist')
        }
      } else {
        const { error } = await addToWishlist(product.id)
        if (error) {
          showError(error.message)
        } else {
          setInWishlist(true)
          await checkWishlistStatus() // Get the new item ID
          success('Added to wishlist')
        }
      }
    } catch (err) {
      console.error('Wishlist error:', err)
      showError('Failed to update wishlist')
    } finally {
      setWishlistLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Products with variants or apparel category should go to detail page for size/color selection
  const hasVariants = product.hasVariants || product.category === 'apparel'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (hasVariants) {
      // Navigate to product page for variant selection
      navigate(`/product/${product.id}`)
    } else {
      addItem(product)
    }
  }

  const inCart = isInCart(product.id)

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.thumbnail || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            Sale
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
            Featured
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Button
            size="icon-sm"
            variant="secondary"
            onClick={handleAddToCart}
            className="shadow-md"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-medium text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        {product.author && (
          <p className="text-sm text-muted-foreground mb-2">by {product.author}</p>
        )}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            className="flex-1"
            variant={inCart && !hasVariants ? 'secondary' : 'default'}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {hasVariants ? 'Select Options' : inCart ? 'Add More' : 'Add to Cart'}
          </Button>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant={inWishlist ? "default" : "outline"}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              className="flex-1 sm:flex-none"
            >
              {wishlistLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
              )}
            </Button>
            <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()} className="flex-1 sm:flex-none">
              <Button size="icon" variant="outline" title="Quick View" className="w-full">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
