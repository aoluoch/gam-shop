import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProductForm, type ProductFormData } from '@/components/admin'
import { getProductById, createProduct, updateProduct } from '@/services/admin.service'
import { ROUTES } from '@/constants/routes'
import { useToast } from '@/hooks/useToast'
import type { Product } from '@/types/product'

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  const isEditing = id && id !== 'new'

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(!!isEditing)

  const loadProduct = useCallback(async (productId: string) => {
    try {
      const data = await getProductById(productId)
      setProduct(data)
    } catch (error) {
      console.error('Error loading product:', error)
      showError('Failed to load product')
      navigate(ROUTES.ADMIN_PRODUCTS)
    } finally {
      setPageLoading(false)
    }
  }, [navigate, showError])

  useEffect(() => {
    if (isEditing && id) {
      loadProduct(id)
    }
  }, [id, isEditing, loadProduct])

  async function handleSubmit(data: ProductFormData) {
    setLoading(true)
    try {
      if (isEditing && id) {
        const { error } = await updateProduct(id, data)
        if (error) {
          showError(error.message)
          return
        }
        success('Product updated successfully')
      } else {
        const { error } = await createProduct(data)
        if (error) {
          showError(error.message)
          return
        }
        success('Product created successfully')
      }
      navigate(ROUTES.ADMIN_PRODUCTS)
    } catch (error) {
      console.error('Error saving product:', error)
      showError('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
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
      <ProductForm product={product} onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
