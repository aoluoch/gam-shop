import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit2, Trash2, FolderTree, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/useToast'
import { supabase } from '@/services/supabase'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
}

const DEFAULT_CATEGORIES: Omit<Category, 'productCount'>[] = [
  { id: '1', name: 'Books', slug: 'books', description: 'Spiritual books and publications' },
  { id: '2', name: 'Apparel', slug: 'apparel', description: 'T-shirts and clothing items' },
  { id: '3', name: 'Accessories', slug: 'accessories', description: 'Caps, rubber bands and more' },
]

export function CategoriesPage() {
  const { success, error: showError } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })

  const loadCategoryCounts = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch product counts grouped by category
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true)

      if (error) {
        console.error('Error fetching product counts:', error)
        showError('Failed to load category counts')
        return
      }

      // Count products per category
      const counts: Record<string, number> = {}
      data?.forEach((product) => {
        const cat = product.category?.toLowerCase() || 'unknown'
        counts[cat] = (counts[cat] || 0) + 1
      })

      // Map default categories with actual counts
      const categoriesWithCounts: Category[] = DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        productCount: counts[cat.slug] || 0,
      }))

      setCategories(categoriesWithCounts)
    } catch (error) {
      console.error('Error loading categories:', error)
      showError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    loadCategoryCounts()
  }, [loadCategoryCounts])

  function handleEdit(category: Category) {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
    })
    setShowForm(true)
  }

  function handleAdd() {
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '' })
    setShowForm(true)
  }

  function handleDelete(id: string) {
    setCategories(categories.filter(c => c.id !== id))
    success('Category deleted')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      showError('Category name is required')
      return
    }

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')

    if (editingId) {
      setCategories(categories.map(c => 
        c.id === editingId 
          ? { ...c, name: formData.name, slug, description: formData.description }
          : c
      ))
      success('Category updated')
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        slug,
        description: formData.description,
        productCount: 0,
      }
      setCategories([...categories, newCategory])
      success('Category created')
    }

    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '' })
  }

  function handleCancel() {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '' })
  }

  if (loading) {
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
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Category' : 'New Category'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update the category details' : 'Create a new product category'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Books"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., books (auto-generated if empty)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the category"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'} Category
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No categories yet</p>
              <Button variant="outline" className="mt-4" onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first category
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Slug</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Description</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Products</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{category.name}</td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-sm">{category.slug}</td>
                      <td className="py-3 px-4 text-muted-foreground">{category.description || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                          {category.productCount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
