export interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  category: 'books' | 'apparel' | 'accessories'
  subcategory?: string
  images: string[]
  thumbnail: string
  stock: number
  sku: string
  featured: boolean
  author?: string
  size?: string
  color?: string
  createdAt: string
  updatedAt: string
  variants?: ProductVariant[]
  hasVariants?: boolean
}

export interface ProductVariant {
  id: string
  productId: string
  size: string
  color: string
  stock: number
  skuSuffix?: string
  priceAdjustment?: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  altText?: string
  displayOrder: number
  isThumbnail: boolean
  createdAt?: string
}

export interface VariantFormData {
  size: string
  color: string
  stock: number
  skuSuffix?: string
  priceAdjustment?: number
}

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] as const
export const COLORS = [
  'Black', 'White', 'Navy', 'Gray', 'Red', 'Blue', 
  'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown'
] as const

export type Size = typeof SIZES[number]
export type Color = typeof COLORS[number]

export type ProductCategory = 'books' | 'apparel' | 'accessories'

export interface ProductFilter {
  category?: ProductCategory
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  search?: string
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest'
}
