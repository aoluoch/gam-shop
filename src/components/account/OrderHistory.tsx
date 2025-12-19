import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, Loader2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { getUserOrders } from '@/services/order.service'
import type { Order } from '@/types/order'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserOrders()
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching orders:', error)
        setLoading(false)
      })
  }, [])

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
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium text-lg mb-2">No orders yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Your order history will appear here
          </p>
          <Button asChild>
            <Link to={ROUTES.SHOP}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Start Shopping
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <Card key={order.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                {order.items.slice(0, 3).map((item, index) => (
                  <div
                    key={item.id}
                    className="w-12 h-12 rounded-md border-2 border-background bg-muted overflow-hidden"
                    style={{ zIndex: 3 - index }}
                  >
                    <img
                      src={item.productImage || '/placeholder.svg'}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 rounded-md border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{order.items.length} items</p>
                <p className="text-sm text-muted-foreground">Total: {formatPrice(order.total)}</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`${ROUTES.ORDERS}/${order.id}`}>
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
