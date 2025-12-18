import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { OrderDetails } from '@/components/admin'
import { getOrderById, updateOrderStatus, updatePaymentStatus } from '@/services/admin.service'
import { ROUTES } from '@/constants/routes'
import { useToast } from '@/hooks/useToast'
import type { Order, OrderStatus, PaymentStatus } from '@/types/order'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error: showError } = useToast()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const loadOrder = useCallback(async (orderId: string) => {
    try {
      const data = await getOrderById(orderId)
      if (!data) {
        showError('Order not found')
        navigate(ROUTES.ADMIN_ORDERS)
        return
      }
      setOrder(data)
    } catch (error) {
      console.error('Error loading order:', error)
      showError('Failed to load order')
      navigate(ROUTES.ADMIN_ORDERS)
    } finally {
      setLoading(false)
    }
  }, [navigate, showError])

  useEffect(() => {
    if (id) {
      loadOrder(id)
    }
  }, [id, loadOrder])

  async function handleStatusChange(status: OrderStatus) {
    if (!id || !order) return
    try {
      const { error } = await updateOrderStatus(id, status)
      if (error) {
        showError(error.message)
        return
      }
      setOrder({ ...order, status })
      success('Order status updated')
    } catch (error) {
      console.error('Error updating order status:', error)
      showError('Failed to update order status')
    }
  }

  async function handlePaymentStatusChange(paymentStatus: PaymentStatus) {
    if (!id || !order) return
    try {
      const { error } = await updatePaymentStatus(id, paymentStatus)
      if (error) {
        showError(error.message)
        return
      }
      setOrder({ ...order, paymentStatus })
      success('Payment status updated')
    } catch (error) {
      console.error('Error updating payment status:', error)
      showError('Failed to update payment status')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetails
        order={order}
        onStatusChange={handleStatusChange}
        onPaymentStatusChange={handlePaymentStatusChange}
      />
    </div>
  )
}
