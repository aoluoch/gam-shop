import { useEffect, useState, useCallback } from 'react'
import { OrderTable } from '@/components/admin'
import { getOrders, updateOrderStatus, updatePaymentStatus } from '@/services/admin.service'
import type { Order, OrderStatus, PaymentStatus } from '@/types/order'
import { useToast } from '@/hooks/useToast'

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useToast()

  const loadOrders = useCallback(async () => {
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
      showError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  async function handleStatusChange(id: string, status: OrderStatus) {
    try {
      const { error } = await updateOrderStatus(id, status)
      if (error) {
        showError(error.message)
        return
      }
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)))
      success('Order status updated')
    } catch (error) {
      console.error('Error updating order status:', error)
      showError('Failed to update order status')
    }
  }

  async function handlePaymentStatusChange(id: string, paymentStatus: PaymentStatus) {
    try {
      const { error } = await updatePaymentStatus(id, paymentStatus)
      if (error) {
        showError(error.message)
        return
      }
      setOrders(orders.map((o) => (o.id === id ? { ...o, paymentStatus } : o)))
      success('Payment status updated')
    } catch (error) {
      console.error('Error updating payment status:', error)
      showError('Failed to update payment status')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <OrderTable
        orders={orders}
        onStatusChange={handleStatusChange}
        onPaymentStatusChange={handlePaymentStatusChange}
        loading={loading}
      />
    </div>
  )
}
