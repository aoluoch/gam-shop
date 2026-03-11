import type { Product } from './product'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export interface CartContextType {
  items: CartItem[]
  itemCount: number
  productCount: number
  subtotal: number
  shipping: number
  tax: number
  total: number
  freeShippingThreshold: number
  shippingCity: string | null
  setShippingCity: (city: string | null) => void
  calculateShippingWithCity: (city: string) => number
  addItem: (product: Product, quantity?: number, options?: { size?: string; color?: string }) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
  getItemQuantity: (productId: string) => number
}
