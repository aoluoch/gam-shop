import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getOptimizedImageUrl } from '@/services/cloudinary.service'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { supabase } from '@/services/supabase'
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/services/wishlist.service'
import { cn } from '@/lib/utils'
import { ReviewSection } from '@/components/product/ReviewSection'
import type { Product, ProductVariant } from '@/types/product'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem, isInCart } = useCart()
  const { user } = useAuth()
  const { success, error: showError } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const loadProduct = useCallback(async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        showError('Product not found')
        navigate('/shop')
        return
      }

      const mappedProduct: Product = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        compareAtPrice: data.compare_at_price ? Number(data.compare_at_price) : undefined,
        category: data.category,
        subcategory: data.subcategory,
        images: data.images || [],
        thumbnail: data.thumbnail,
        stock: Number(data.stock),
        sku: data.sku,
        featured: data.featured,
        author: data.author,
        size: data.size,
        color: data.color,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      setProduct(mappedProduct)

      // Fetch variants
      const { data: variantsData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .eq('is_active', true)

      if (variantsData && variantsData.length > 0) {
        const mappedVariants: ProductVariant[] = variantsData.map(v => ({
          id: v.id,
          productId: v.product_id,
          size: v.size,
          color: v.color,
          stock: Number(v.stock),
          skuSuffix: v.sku_suffix,
          priceAdjustment: v.price_adjustment ? Number(v.price_adjustment) : undefined,
          isActive: v.is_active,
        }))
        setVariants(mappedVariants)
        mappedProduct.hasVariants = true
        mappedProduct.variants = mappedVariants
      }
    } catch (err) {
      console.error('Error loading product:', err)
      showError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }, [navigate, showError])

  useEffect(() => {
    if (id) {
      loadProduct(id)
    }
  }, [id, loadProduct])

  useEffect(() => {
    if (user && id) {
      checkWishlistStatus()
    } else {
      setInWishlist(false)
      setWishlistItemId(null)
    }
  }, [user, id])

  async function checkWishlistStatus() {
    if (!id) return
    const inList = await isInWishlist(id)
    setInWishlist(inList)
    if (inList) {
      const { data } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('product_id', id)
        .maybeSingle()
      if (data) {
        setWishlistItemId(data.id)
      }
    }
  }

  async function handleWishlistToggle() {
    if (!user) {
      showError('Please login to add items to your wishlist')
      navigate('/login')
      return
    }

    if (!id) return

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
        const { error } = await addToWishlist(id)
        if (error) {
          showError(error.message)
        } else {
          setInWishlist(true)
          await checkWishlistStatus()
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

  // Get unique sizes and colors from variants
  const availableSizes = useMemo(() => {
    if (variants.length === 0) return []
    const sizes = [...new Set(variants.map(v => v.size))]
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
    return sizes.sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a)
      const bIndex = sizeOrder.indexOf(b)
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
  }, [variants])

  const availableColors = useMemo(() => {
    if (variants.length === 0) return []
    if (!selectedSize) {
      return [...new Set(variants.map(v => v.color))]
    }
    return [...new Set(variants.filter(v => v.size === selectedSize).map(v => v.color))]
  }, [variants, selectedSize])

  // Get stock for selected variant
  const selectedVariant = useMemo(() => {
    if (!selectedSize || !selectedColor) return null
    return variants.find(v => v.size === selectedSize && v.color === selectedColor)
  }, [variants, selectedSize, selectedColor])

  const currentStock = useMemo(() => {
    if (variants.length > 0) {
      return selectedVariant?.stock ?? 0
    }
    return product?.stock ?? 0
  }, [variants, selectedVariant, product])

  const isOutOfStock = currentStock === 0

  const canAddToCart = useMemo(() => {
    if (!product) return false
    if (variants.length > 0) {
      return selectedSize && selectedColor && currentStock > 0 && quantity <= currentStock
    }
    return currentStock > 0 && quantity <= currentStock
  }, [product, variants, selectedSize, selectedColor, currentStock, quantity])

  const handleAddToCart = () => {
    if (!product || !canAddToCart) return

    addItem(product, quantity, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    })

    success(`${product.name} added to cart`)
  }

  const nextImage = () => {
    if (!product) return
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    if (!product) return
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail]
  const currentImage = images[selectedImageIndex] || product.thumbnail

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={getOptimizedImageUrl(currentImage, { width: 800, height: 800 })}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-2 rounded-md font-medium">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors',
                    selectedImageIndex === index
                      ? 'border-primary'
                      : 'border-transparent hover:border-muted-foreground/50'
                  )}
                >
                  <img
                    src={getOptimizedImageUrl(image, { width: 100, height: 100 })}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            {product.author && (
              <p className="text-muted-foreground mt-1">by {product.author}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              KES {product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-muted-foreground line-through">
                KES {product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selection */}
          {variants.length > 0 && (
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Size Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Size</label>
                    {selectedSize && (
                      <span className="text-xs text-muted-foreground">
                        Selected: {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                      const hasStock = variants.some(v => v.size === size && v.stock > 0)
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size)
                            // Reset color if not available for this size
                            if (selectedColor) {
                              const colorAvailable = variants.some(
                                v => v.size === size && v.color === selectedColor
                              )
                              if (!colorAvailable) {
                                setSelectedColor(null)
                              }
                            }
                          }}
                          disabled={!hasStock}
                          className={cn(
                            'px-4 py-2 rounded-md text-sm font-medium border transition-colors',
                            selectedSize === size
                              ? 'bg-primary text-primary-foreground border-primary'
                              : hasStock
                                ? 'bg-background hover:bg-muted border-input'
                                : 'bg-muted text-muted-foreground border-input opacity-50 cursor-not-allowed line-through'
                          )}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Color</label>
                    {selectedColor && (
                      <span className="text-xs text-muted-foreground">
                        Selected: {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => {
                      const variant = selectedSize
                        ? variants.find(v => v.size === selectedSize && v.color === color)
                        : variants.find(v => v.color === color && v.stock > 0)
                      const hasStock = variant && variant.stock > 0
                      
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          disabled={!hasStock}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border transition-colors',
                            selectedColor === color
                              ? 'bg-primary text-primary-foreground border-primary'
                              : hasStock
                                ? 'bg-background hover:bg-muted border-input'
                                : 'bg-muted text-muted-foreground border-input opacity-50 cursor-not-allowed'
                          )}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                          {color}
                          {selectedColor === color && <Check className="h-3 w-3" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Stock indicator */}
                {selectedSize && selectedColor && (
                  <div className={cn(
                    'flex items-center gap-2 text-sm',
                    currentStock > 0 ? 'text-green-600' : 'text-red-600'
                  )}>
                    {currentStock > 0 ? (
                      <>
                        <Check className="h-4 w-4" />
                        {currentStock <= 5 ? (
                          <span>Only {currentStock} left in stock</span>
                        ) : (
                          <span>In stock ({currentStock} available)</span>
                        )}
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span>Out of stock for this combination</span>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                  disabled={quantity >= currentStock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Variant selection reminder */}
            {variants.length > 0 && (!selectedSize || !selectedColor) && (
              <p className="text-sm text-amber-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Please select size and color before adding to cart
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isInCart(product.id) ? 'Add More' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant={inWishlist ? "default" : "outline"}
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                {wishlistLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
                )}
              </Button>
            </div>
          </div>

          {/* Product Meta */}
          <div className="border-t pt-6 space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">SKU:</span> {product.sku}</p>
            <p><span className="font-medium text-foreground">Category:</span> {product.category}</p>
            {product.subcategory && (
              <p><span className="font-medium text-foreground">Subcategory:</span> {product.subcategory}</p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection productId={product.id} />
    </div>
  )
}
