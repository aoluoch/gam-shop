import { useEffect, useState } from 'react'
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react'
import { StatsCard, RecentOrders } from '@/components/admin'
import { getDashboardStats, type DashboardStats } from '@/services/admin.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Revenue"
          value={`KSh ${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          description="From paid orders"
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
          description="All time orders"
        />
        <StatsCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
          description="Registered users"
        />
        <StatsCard
          title="Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          description="Active products"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders orders={stats?.recentOrders || []} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Low Stock Alert</CardTitle>
            <Link
              to={ROUTES.ADMIN_PRODUCTS}
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.lowStockProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                All products are well stocked
              </p>
            ) : (
              <div className="space-y-4">
                {stats?.lowStockProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
