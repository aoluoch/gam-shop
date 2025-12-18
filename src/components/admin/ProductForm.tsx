import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { ImageUploader } from './ImageUploader'
import { VariantManager } from './VariantManager'
import type { Product, ProductCategory, VariantFormData } from '@/types/product'

interface ProductFormProps {
  product?: Product | null
  onSubmit: (data: ProductFormData) => Promise<void>
  loading?: boolean
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  compareAtPrice?: number
  category: ProductCategory
  subcategory?: string
  images: string[]
  thumbnail: string
  stock: number
  sku: string
  featured: boolean
  author?: string
  size?: string
  color?: string
  hasVariants?: boolean
  variants?: VariantFormData[]
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'books', label: 'Books' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
]

function getInitialFormData(product?: Product | null): ProductFormData {
  if (product) {
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.category,
      subcategory: product.subcategory || '',
      images: product.images,
      thumbnail: product.thumbnail,
      stock: product.stock,
      sku: product.sku,
      featured: product.featured,
      author: product.author || '',
      size: product.size || '',
      color: product.color || '',
      hasVariants: product.hasVariants || false,
      variants: product.variants?.map(v => ({
        size: v.size,
        color: v.color,
        stock: v.stock,
        skuSuffix: v.skuSuffix,
        priceAdjustment: v.priceAdjustment,
      })) || [],
    }
  }
  return {
    name: '',
    description: '',
    price: 0,
    compareAtPrice: undefined,
    category: 'books',
    subcategory: '',
    images: [],
    thumbnail: '',
    stock: 0,
    sku: '',
    featured: false,
    author: '',
    size: '',
    color: '',
    hasVariants: false,
    variants: [],
  }
}

export function ProductForm({ product, onSubmit, loading }: ProductFormProps) {
  const navigate = useNavigate()
  const isEditing = !!product

  const [formData, setFormData] = useState<ProductFormData>(() => getInitialFormData(product))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required'
    }
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    await onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Product' : 'New Product'}
          </h1>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Compare at Price</Label>
                  <Input
                    id="compareAtPrice"
                    name="compareAtPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.compareAtPrice || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                images={formData.images}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                thumbnail={formData.thumbnail}
                onThumbnailChange={(thumbnail) => setFormData(prev => ({ ...prev, thumbnail }))}
                maxImages={10}
              />
            </CardContent>
          </Card>

          {/* Variant Manager for Apparel */}
          {formData.category === 'apparel' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasVariants"
                  checked={formData.hasVariants}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    hasVariants: e.target.checked,
                    variants: e.target.checked ? prev.variants : []
                  }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="hasVariants" className="text-base font-medium">
                  This product has size/color variants
                </Label>
              </div>

              {formData.hasVariants && (
                <VariantManager
                  variants={formData.variants || []}
                  onVariantsChange={(variants) => {
                    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
                    setFormData(prev => ({ ...prev, variants, stock: totalStock }))
                  }}
                />
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  placeholder="Enter subcategory"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="GAM-XXX-001"
                />
                {errors.sku && <p className="text-sm text-red-600">{errors.sku}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="featured">Featured product</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.hasVariants && formData.category === 'apparel' ? (
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                  <p className="font-medium text-foreground">Stock managed by variants</p>
                  <p className="mt-1">Total stock: {formData.stock} units across all size/color combinations.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                  />
                  {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Book-specific fields */}
          {formData.category === 'books' && (
            <Card>
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author name"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Accessories simple size/color (not using variant system) */}
          {formData.category === 'accessories' && (
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="One Size, S/M/L, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Black, White, etc."
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  )
}
