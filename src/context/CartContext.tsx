import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem } from '@/types/cart'
import type { Product } from '@/types/product'
import { CartContext } from './CartContextDef'
import { supabase } from '@/services/supabase'

const CART_STORAGE_KEY = 'gam-shop-cart'
// Default values (fallback if settings can't be loaded)
const DEFAULT_SHIPPING_THRESHOLD = 5000 // Free shipping over KES 5000
const DEFAULT_SHIPPING_COST = 300 // KES (standard shipping rate)
const DEFAULT_TAX_RATE = 0.16 // 16% VAT

interface StoreSettings {
  freeShippingThreshold: number
  standardShippingRate: number
  taxRate: number
}

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

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    freeShippingThreshold: DEFAULT_SHIPPING_THRESHOLD,
    standardShippingRate: DEFAULT_SHIPPING_COST,
    taxRate: DEFAULT_TAX_RATE,
  })

  // Load store settings from database on mount
  useEffect(() => {
    async function loadStoreSettings() {
      try {
        // Use the public function to get settings (accessible to all users)
        const { data, error } = await supabase.rpc('get_store_settings')

        if (error) {
          console.error('Error loading store settings:', error)
          // Use defaults if error
          return
        }

        if (data && data.length > 0) {
          const settings = data[0]
          const taxRateValue = settings.tax_rate != null ? Number(settings.tax_rate) / 100 : DEFAULT_TAX_RATE
          setStoreSettings({
            freeShippingThreshold: settings.free_shipping_threshold != null 
              ? Number(settings.free_shipping_threshold) 
              : DEFAULT_SHIPPING_THRESHOLD,
            standardShippingRate: settings.standard_shipping_rate != null 
              ? Number(settings.standard_shipping_rate) 
              : DEFAULT_SHIPPING_COST,
            taxRate: isNaN(taxRateValue) ? DEFAULT_TAX_RATE : taxRateValue,
          })
        }
      } catch (error) {
        console.error('Error loading store settings:', error)
        // Use defaults if error
      }
    }

    loadStoreSettings()
  }, [])

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
    return subtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.standardShippingRate
  }, [subtotal, items.length, storeSettings.freeShippingThreshold, storeSettings.standardShippingRate])

  const tax = useMemo(() => {
    return Math.round(subtotal * storeSettings.taxRate)
  }, [subtotal, storeSettings.taxRate])

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
        freeShippingThreshold: storeSettings.freeShippingThreshold,
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
