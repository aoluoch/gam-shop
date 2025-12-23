import { useEffect, useState, useCallback } from 'react'
import { Loader2, Download, DollarSign, Truck, Receipt, PiggyBank } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { supabase } from '@/services/supabase'
import { format } from 'date-fns'

interface OrderFinancials {
  id: string
  orderNumber: string
  date: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  vatAmount: number
  netRevenue: number
}

interface FinancialSummary {
  totalSales: number
  totalVAT: number
  totalDeliveryFees: number
  totalNetRevenue: number
  totalAmountCollected: number
  orders: OrderFinancials[]
}

export function FinancialSheetPage() {
  const [data, setData] = useState<FinancialSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'quarter' | 'year'>('month')

  const loadFinancialData = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false })

      // Apply date filter
      const now = new Date()
      if (dateRange === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        query = query.gte('created_at', startOfMonth.toISOString())
      } else if (dateRange === 'quarter') {
        const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        query = query.gte('created_at', startOfQuarter.toISOString())
      } else if (dateRange === 'year') {
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        query = query.gte('created_at', startOfYear.toISOString())
      }

      const { data: orders, error } = await query

      if (error) throw error

      const orderFinancials: OrderFinancials[] = (orders || []).map(order => {
        const subtotal = Number(order.subtotal)
        const shipping = Number(order.shipping)
        const tax = Number(order.tax) // Use the actual tax value stored in the order
        const total = Number(order.total)
        
        // Use the actual tax/VAT amount stored in the order
        // This ensures we use the correct VAT rate that was applied at the time of order
        // This also handles VAT exemption (0%) correctly
        const vatAmount = tax
        const netRevenue = subtotal - vatAmount

        // Verify the calculation: subtotal + shipping + tax should equal total
        const calculatedTotal = subtotal + shipping + tax
        if (Math.abs(calculatedTotal - total) > 0.01) {
          console.warn(`Order ${order.order_number} total mismatch: calculated ${calculatedTotal}, stored ${total}`)
        }

        return {
          id: order.id,
          orderNumber: order.order_number,
          date: order.created_at,
          subtotal,
          shipping,
          tax,
          total,
          vatAmount,
          netRevenue,
        }
      })

      const totalSales = orderFinancials.reduce((sum, o) => sum + o.subtotal, 0)
      const totalVAT = orderFinancials.reduce((sum, o) => sum + o.vatAmount, 0)
      const totalDeliveryFees = orderFinancials.reduce((sum, o) => sum + o.shipping, 0)
      const totalNetRevenue = orderFinancials.reduce((sum, o) => sum + o.netRevenue, 0)
      const totalAmountCollected = orderFinancials.reduce((sum, o) => sum + o.total, 0)

      setData({
        totalSales,
        totalVAT,
        totalDeliveryFees,
        totalNetRevenue,
        totalAmountCollected,
        orders: orderFinancials,
      })
    } catch (error) {
      console.error('Error loading financial data:', error)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    loadFinancialData()
  }, [loadFinancialData])

  function exportToCSV() {
    if (!data) return

    const headers = ['Order Number', 'Date', 'Subtotal', 'Delivery Fee', 'VAT', 'Net Revenue', 'Total']
    const rows = data.orders.map(order => [
      order.orderNumber,
      format(new Date(order.date), 'yyyy-MM-dd'),
      order.subtotal.toFixed(2),
      order.shipping.toFixed(2),
      order.vatAmount.toFixed(2),
      order.netRevenue.toFixed(2),
      order.total.toFixed(2),
    ])

    // Add summary row
    rows.push([])
    rows.push(['TOTALS', '', data.totalSales.toFixed(2), data.totalDeliveryFees.toFixed(2), data.totalVAT.toFixed(2), data.totalNetRevenue.toFixed(2), data.totalAmountCollected.toFixed(2)])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financial-sheet-${dateRange}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load financial data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Sheet</h1>
          <p className="text-muted-foreground">Track sales, VAT, delivery fees, and net revenue</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {(['month', 'quarter', 'year', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  dateRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {range === 'month' ? 'This Month' : 
                 range === 'quarter' ? 'This Quarter' : 
                 range === 'year' ? 'This Year' : 'All Time'}
              </button>
            ))}
          </div>
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {data.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Product sales before VAT deduction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VAT Collected</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">KSh {data.totalVAT.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">To be remitted to KRA (if applicable)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Fees</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">KSh {data.totalDeliveryFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Shipping fees collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">KSh {data.totalNetRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">After VAT deduction</p>
          </CardContent>
        </Card>
      </div>

      {/* Balance Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="font-medium">Gross Sales (Product Revenue)</span>
              <span className="font-bold">KSh {data.totalSales.toLocaleString()}</span>
            </div>
            {data.totalVAT > 0 && (
              <div className="flex justify-between items-center py-3 border-b text-amber-600">
                <span className="font-medium">Less: VAT Payable to Government</span>
                <span className="font-bold">- KSh {data.totalVAT.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3 border-b">
              <span className="font-medium">Net Product Revenue</span>
              <span className="font-bold">KSh {data.totalNetRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b text-blue-600">
              <span className="font-medium">Add: Delivery Fees Collected</span>
              <span className="font-bold">+ KSh {data.totalDeliveryFees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-green-50 dark:bg-green-950 px-4 rounded-lg text-green-700 dark:text-green-400">
              <span className="text-lg font-semibold">Total Amount Collected</span>
              <span className="text-xl font-bold">KSh {data.totalAmountCollected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 mt-2 text-sm text-muted-foreground border-t pt-2">
              <span>Verification: Subtotal + Shipping + VAT</span>
              <span>KSh {(data.totalSales + data.totalDeliveryFees + data.totalVAT).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">Delivery</TableHead>
                <TableHead className="text-right">VAT</TableHead>
                <TableHead className="text-right">Net Revenue</TableHead>
                <TableHead className="text-right">Total Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.orderNumber}</TableCell>
                  <TableCell>{format(new Date(order.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">KSh {order.subtotal.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-blue-600">KSh {order.shipping.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-amber-600">
                    {order.vatAmount > 0 ? `KSh ${order.vatAmount.toLocaleString()}` : 'Exempt'}
                  </TableCell>
                  <TableCell className="text-right text-green-600">KSh {order.netRevenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold">KSh {order.total.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {data.orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No paid orders found for this period
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {data.orders.length > 0 && (
              <TableFooter>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={2} className="font-bold">TOTALS</TableCell>
                  <TableCell className="text-right font-bold">KSh {data.totalSales.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold text-blue-600">KSh {data.totalDeliveryFees.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold text-amber-600">KSh {data.totalVAT.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold text-green-600">KSh {data.totalNetRevenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">KSh {data.totalAmountCollected.toLocaleString()}</TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
