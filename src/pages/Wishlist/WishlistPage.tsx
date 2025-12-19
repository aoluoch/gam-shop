import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, Loader2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { getWishlistItems, removeFromWishlist, moveToCart, type WishlistItem } from '@/services/wishlist.service'
import { useToast } from '@/hooks/useToast'
import { useCart } from '@/hooks/useCart'

export function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { success, error: showError } = useToast()
  useCart() // Hook used for cart context availability

  const loadWishlist = useCallback(async () => {
    try {
      const data = await getWishlistItems()
      setItems(data)
    } catch (error) {
      console.error('Error loading wishlist:', error)
      showError('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  async function handleRemove(itemId: string) {
    setActionLoading(itemId)
    try {
      const { error } = await removeFromWishlist(itemId)
      if (error) {
        showError(error.message)
      } else {
        setItems(items.filter(item => item.id !== itemId))
        success('Item removed from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      showError('Failed to remove item')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleMoveToCart(itemId: string) {
    setActionLoading(itemId)
    try {
      const { error } = await moveToCart(itemId)
      if (error) {
        showError(error.message)
      } else {
        setItems(items.filter(item => item.id !== itemId))
        success('Item moved to cart')
      }
    } catch (error) {
      console.error('Error moving to cart:', error)
      showError('Failed to move item to cart')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center gap-2 sm:gap-3">
          <Heart className="h-8 w-8" />
          My Wishlist
        </h1>
        <p className="text-muted-foreground mt-2">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love to your wishlist and they'll show up here.
            </p>
            <Button asChild>
              <Link to={ROUTES.SHOP}>Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <Link to={`/product/${item.product.id}`}>
                <div className="aspect-square relative overflow-hidden bg-muted">
                  {item.product.thumbnail ? (
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  {item.product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    KSh {item.product.price.toLocaleString()}
                  </span>
                  {item.product.compareAtPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      KSh {item.product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 capitalize">
                  {item.product.category}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleMoveToCart(item.id)}
                    disabled={actionLoading === item.id || item.product.stock === 0}
                  >
                    {actionLoading === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(item.id)}
                    disabled={actionLoading === item.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
