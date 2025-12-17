import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem, CartContextType } from '@/types/cart'
import type { Product } from '@/types/product'

const CART_STORAGE_KEY = 'gam-shop-cart'
const SHIPPING_THRESHOLD = 5000 // Free shipping over KES 5000
const SHIPPING_COST = 350 // KES
const TAX_RATE = 0.16 // 16% VAT

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    return []
  })

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const itemCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  const productCount = useMemo(() => {
    return items.length
  }, [items])

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }, [items])

  const shipping = useMemo(() => {
    if (items.length === 0) return 0
    return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  }, [subtotal, items.length])

  const tax = useMemo(() => {
    return Math.round(subtotal * TAX_RATE)
  }, [subtotal])

  const total = useMemo(() => {
    return subtotal + shipping + tax
  }, [subtotal, shipping, tax])

  const addItem = useCallback((
    product: Product,
    quantity = 1,
    options?: { size?: string; color?: string }
  ) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedSize === options?.size &&
          item.selectedColor === options?.color
      )

      if (existingItemIndex > -1) {
        const newItems = [...currentItems]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        }
        return newItems
      }

      const newItem: CartItem = {
        id: `${product.id}-${options?.size || ''}-${options?.color || ''}-${Date.now()}`,
        product,
        quantity,
        selectedSize: options?.size,
        selectedColor: options?.color,
      }
      return [...currentItems, newItem]
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(itemId)
      return
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const isInCart = useCallback((productId: string) => {
    return items.some(item => item.product.id === productId)
  }, [items])

  const getItemQuantity = useCallback((productId: string) => {
    return items
      .filter(item => item.product.id === productId)
      .reduce((total, item) => total + item.quantity, 0)
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        productCount,
        subtotal,
        shipping,
        tax,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
