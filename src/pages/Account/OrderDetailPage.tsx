import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserOrderById } from '@/services/order.service'
import { ROUTES } from '@/constants/routes'
import type { Order } from '@/types/order'

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  processing: { label: 'Processing', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
}

const paymentStatusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  paid: { label: 'Paid', color: 'text-green-600', bg: 'bg-green-100' },
  failed: { label: 'Failed', color: 'text-red-600', bg: 'bg-red-100' },
  refunded: { label: 'Refunded', color: 'text-gray-600', bg: 'bg-gray-100' },
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getUserOrderById(id)
        .then(data => {
          if (!data) {
            navigate(ROUTES.ORDERS)
            return
          }
          setOrder(data)
        })
        .catch(error => {
          console.error('Error loading order:', error)
          navigate(ROUTES.ORDERS)
        })
        .finally(() => setLoading(false))
    }
  }, [id, navigate])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  const status = statusConfig[order.status]
  const paymentStatus = paymentStatusConfig[order.paymentStatus]
  const StatusIcon = status.icon

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to={ROUTES.ORDERS}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Status Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${status.bg}`}>
                    <StatusIcon className={`h-5 w-5 ${status.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Status</p>
                    <p className={`font-semibold ${status.color}`}>{status.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${paymentStatus.bg}`}>
                    <CheckCircle className={`h-5 w-5 ${paymentStatus.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <p className={`font-semibold ${paymentStatus.color}`}>{paymentStatus.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {order.items.map(item => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                      <img
                        src={item.productImage || '/placeholder.svg'}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.productName}</p>
                      {(item.size || item.color) && (
                        <p className="text-sm text-muted-foreground">
                          {[item.size, item.color].filter(Boolean).join(' / ')}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary & Shipping */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="pt-2 text-muted-foreground">{order.shippingAddress.phone}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (VAT 16%)</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
                {order.paymentReference && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Payment Reference: {order.paymentReference}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
