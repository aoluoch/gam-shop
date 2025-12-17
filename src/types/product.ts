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
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  stock: number
  size?: string
  color?: string
}

export type ProductCategory = 'books' | 'apparel' | 'accessories'

export interface ProductFilter {
  category?: ProductCategory
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  search?: string
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest'
}
