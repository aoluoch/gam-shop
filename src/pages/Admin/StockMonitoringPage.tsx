import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Package, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supabase } from '@/services/supabase'
import { ROUTES } from '@/constants/routes'
import type { Product } from '@/types/product'

interface StockProduct extends Product {
  stockStatus: 'out_of_stock' | 'low_stock' | 'in_stock'
}

export function StockMonitoringPage() {
  const [products, setProducts] = useState<StockProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('stock', { ascending: true })

      if (error) throw error

      const mappedProducts: StockProduct[] = (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
        category: p.category,
        subcategory: p.subcategory,
        images: p.images || [],
        thumbnail: p.thumbnail,
        stock: Number(p.stock),
        sku: p.sku,
        featured: p.featured,
        author: p.author,
        size: p.size,
        color: p.color,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        stockStatus: p.stock === 0 ? 'out_of_stock' : p.stock < 10 ? 'low_stock' : 'in_stock',
      }))

      setProducts(mappedProducts)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()

    // Set up real-time subscription for stock updates
    const channel = supabase
      .channel('stock-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          loadProducts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadProducts])

  const filteredProducts = products.filter(p => {
    if (filter === 'all') return true
    if (filter === 'low') return p.stockStatus === 'low_stock'
    if (filter === 'out') return p.stockStatus === 'out_of_stock'
    return true
  })

  const outOfStockCount = products.filter(p => p.stockStatus === 'out_of_stock').length
  const lowStockCount = products.filter(p => p.stockStatus === 'low_stock').length
  const inStockCount = products.filter(p => p.stockStatus === 'in_stock').length

  const getStatusBadge = (status: StockProduct['stockStatus']) => {
    switch (status) {
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>
      case 'low_stock':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Low Stock</Badge>
      case 'in_stock':
        return <Badge className="bg-green-500 hover:bg-green-600">In Stock</Badge>
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Monitoring</h1>
          <p className="text-muted-foreground">Real-time inventory tracking</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm" onClick={loadProducts} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={`cursor-pointer transition-all ${filter === 'out' ? 'ring-2 ring-destructive' : ''}`} onClick={() => setFilter('out')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">Products need restocking</p>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer transition-all ${filter === 'low' ? 'ring-2 ring-amber-500' : ''}`} onClick={() => setFilter('low')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <Package className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Products below 10 units</p>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-green-500' : ''}`} onClick={() => setFilter('all')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{inStockCount}</div>
            <p className="text-xs text-muted-foreground">Products well stocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {filter === 'all' ? 'All Products' : filter === 'low' ? 'Low Stock Products' : 'Out of Stock Products'}
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredProducts.length} products
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
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
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell className="capitalize">{product.category}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-semibold ${
                      product.stock === 0 ? 'text-destructive' :
                      product.stock < 10 ? 'text-amber-500' : ''
                    }`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(product.stockStatus)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`${ROUTES.ADMIN_PRODUCTS}/${product.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
