import { supabase } from './supabase'
import { format, subDays, subMonths, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfDay, endOfDay } from 'date-fns'

export interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  revenueChange: number
  ordersChange: number
  revenueOverTime: { date: string; revenue: number }[]
  ordersOverTime: { date: string; orders: number }[]
  salesByCategory: { name: string; value: number }[]
  topProducts: {
    id: string
    name: string
    thumbnail: string
    quantity: number
    revenue: number
  }[]
}

export async function getAnalyticsData(period: '7d' | '30d' | '90d' | '1y'): Promise<AnalyticsData> {
  const now = new Date()
  let startDate: Date
  let previousStartDate: Date

  switch (period) {
    case '7d':
      startDate = subDays(now, 7)
      previousStartDate = subDays(now, 14)
      break
    case '30d':
      startDate = subDays(now, 30)
      previousStartDate = subDays(now, 60)
      break
    case '90d':
      startDate = subDays(now, 90)
      previousStartDate = subDays(now, 180)
      break
    case '1y':
      startDate = subMonths(now, 12)
      previousStartDate = subMonths(now, 24)
      break
  }

  // Query for current period orders
  const { data: ordersWithDetails } = await supabase
    .from('orders')
    .select(`
      id,
      total,
      created_at,
      order_items (
        product_id,
        price,
        quantity,
        product_name
      )
    `)
    .gte('created_at', startDate.toISOString())
    .eq('payment_status', 'paid')

  // Query for previous period orders (for comparison)
  const { data: prevOrdersData } = await supabase
    .from('orders')
    .select('id, total')
    .gte('created_at', previousStartDate.toISOString())
    .lt('created_at', startDate.toISOString())
    .eq('payment_status', 'paid')

  // Fetch product categories in one query for all unique product IDs
  const productIds = new Set<string>()
  ordersWithDetails?.forEach(order => {
    order.order_items?.forEach((item: { product_id: string }) => {
      productIds.add(item.product_id)
    })
  })

  const { data: productData } = await supabase
    .from('products')
    .select('id, category, name, thumbnail')
    .in('id', Array.from(productIds))

  const productMap = new Map(productData?.map(p => [p.id, p]) || [])

  const orders = ordersWithDetails || []
  const prevOrders = prevOrdersData || []

  // Calculate totals
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
  const totalOrders = orders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const prevRevenue = prevOrders.reduce((sum, o) => sum + Number(o.total), 0)
  const prevOrdersCount = prevOrders.length

  const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0
  const ordersChange = prevOrdersCount > 0 ? ((totalOrders - prevOrdersCount) / prevOrdersCount) * 100 : 0

  // Generate time intervals based on period
  let intervals: Date[]
  let dateFormat: string

  if (period === '7d') {
    intervals = eachDayOfInterval({ start: startDate, end: now })
    dateFormat = 'EEE'
  } else if (period === '30d') {
    intervals = eachDayOfInterval({ start: startDate, end: now })
    dateFormat = 'MMM d'
  } else if (period === '90d') {
    intervals = eachWeekOfInterval({ start: startDate, end: now })
    dateFormat = 'MMM d'
  } else {
    intervals = eachMonthOfInterval({ start: startDate, end: now })
    dateFormat = 'MMM yyyy'
  }

  // Revenue over time
  const revenueOverTime = intervals.map(date => {
    const dayStart = startOfDay(date)
    const dayEnd = period === '1y' ? endOfDay(subDays(subMonths(date, -1), 1)) : 
                   period === '90d' ? endOfDay(subDays(date, -6)) : endOfDay(date)
    
    const dayRevenue = orders
      .filter(o => {
        const orderDate = new Date(o.created_at)
        return orderDate >= dayStart && orderDate <= dayEnd
      })
      .reduce((sum, o) => sum + Number(o.total), 0)

    return {
      date: format(date, dateFormat),
      revenue: dayRevenue,
    }
  })

  // Orders over time
  const ordersOverTime = intervals.map(date => {
    const dayStart = startOfDay(date)
    const dayEnd = period === '1y' ? endOfDay(subDays(subMonths(date, -1), 1)) : 
                   period === '90d' ? endOfDay(subDays(date, -6)) : endOfDay(date)
    
    const dayOrders = orders.filter(o => {
      const orderDate = new Date(o.created_at)
      return orderDate >= dayStart && orderDate <= dayEnd
    }).length

    return {
      date: format(date, dateFormat),
      orders: dayOrders,
    }
  })

  // Recalculate with actual categories
  const actualCategoryTotals: Record<string, number> = {}
  orders.forEach(order => {
    const items = order.order_items as Array<{ product_id: string; price: number; quantity: number }>
    items.forEach(item => {
      const product = productMap.get(item.product_id)
      const category = product?.category || 'Other'
      const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1)
      actualCategoryTotals[capitalizedCategory] = (actualCategoryTotals[capitalizedCategory] || 0) + Number(item.price) * item.quantity
    })
  })

  const salesByCategory = Object.entries(actualCategoryTotals).map(([name, value]) => ({
    name,
    value,
  }))

  // Top products
  const productSales: Record<string, { quantity: number; revenue: number }> = {}
  orders.forEach(order => {
    const items = order.order_items as Array<{ product_id: string; product_name: string; product_image: string; price: number; quantity: number }>
    items.forEach(item => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = { quantity: 0, revenue: 0 }
      }
      productSales[item.product_id].quantity += item.quantity
      productSales[item.product_id].revenue += Number(item.price) * item.quantity
    })
  })

  const topProducts = Object.entries(productSales)
    .map(([id, stats]) => {
      const product = productMap.get(id)
      return {
        id,
        name: product?.name || 'Unknown Product',
        thumbnail: product?.thumbnail || '',
        quantity: stats.quantity,
        revenue: stats.revenue,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue: Math.round(averageOrderValue),
    conversionRate: 65, // Placeholder - would need visitor tracking
    revenueChange,
    ordersChange,
    revenueOverTime,
    ordersOverTime,
    salesByCategory,
    topProducts,
  }
}
