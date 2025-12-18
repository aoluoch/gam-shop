import { useEffect, useState, useCallback } from 'react'
import { ProductTable } from '@/components/admin'
import { getProducts, deleteProduct } from '@/services/admin.service'
import type { Product } from '@/types/product'
import { useToast } from '@/hooks/useToast'

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useToast()

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
      showError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  async function handleDelete(id: string) {
    try {
      const { error } = await deleteProduct(id)
      if (error) {
        showError(error.message)
        return
      }
      setProducts(products.filter((p) => p.id !== id))
      success('Product deleted successfully')
    } catch (error) {
      console.error('Error deleting product:', error)
      showError('Failed to delete product')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">Manage your product catalog</p>
      </div>

      <ProductTable products={products} onDelete={handleDelete} loading={loading} />
    </div>
  )
}
