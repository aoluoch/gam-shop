import type { CartItem } from './cart'

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderAddress {
  fullName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  items: OrderItem[]
  shippingAddress: OrderAddress
  billingAddress?: OrderAddress
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  paymentReference?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  size?: string
  color?: string
}

export interface CreateOrderInput {
  items: CartItem[]
  shippingAddressId: string
  billingAddressId?: string
  paymentMethod: string
  notes?: string
}
