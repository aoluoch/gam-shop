import { ArrowLeft, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import type { Order, OrderStatus, PaymentStatus } from '@/types/order'
import { cn } from '@/lib/utils'

interface OrderDetailsProps {
  order: Order
  onStatusChange: (status: OrderStatus) => void
  onPaymentStatusChange: (status: PaymentStatus) => void
  loading?: boolean
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export function OrderDetails({
  order,
  onStatusChange,
  onPaymentStatusChange,
  loading,
}: OrderDetailsProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN_ORDERS)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {order.items.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No items in this order</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-4 border-b last:border-0"
                    >
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-16 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        {(item.size || item.color) && (
                          <div className="flex items-center gap-2 mt-1">
                            {item.size && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-gray-300"
                                  style={{ backgroundColor: item.color.toLowerCase() }}
                                />
                                {item.color}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          Qty: {item.quantity} × KSh {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-medium">
                        KSh {(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingAddress ? (
                <div className="text-sm">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-muted-foreground">{order.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}
                    {order.shippingAddress.state && `, ${order.shippingAddress.state}`}{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="text-muted-foreground mt-2">
                      Phone: {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No shipping address</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
                  className={cn(
                    'mt-1 w-full px-3 py-2 rounded-md text-sm font-medium border-0',
                    STATUS_COLORS[order.status]
                  )}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Payment Status</label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => onPaymentStatusChange(e.target.value as PaymentStatus)}
                  className={cn(
                    'mt-1 w-full px-3 py-2 rounded-md text-sm font-medium border-0',
                    PAYMENT_STATUS_COLORS[order.paymentStatus]
                  )}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>KSh {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>KSh {order.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>KSh {order.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>KSh {order.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
                {order.paymentReference && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono text-xs">{order.paymentReference}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
