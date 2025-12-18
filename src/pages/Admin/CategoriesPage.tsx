import { useState } from 'react'
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/useToast'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
}

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Books', slug: 'books', description: 'Spiritual books and publications', productCount: 0 },
  { id: '2', name: 'Apparel', slug: 'apparel', description: 'T-shirts and clothing items', productCount: 0 },
  { id: '3', name: 'Accessories', slug: 'accessories', description: 'Caps, rubber bands and more', productCount: 0 },
]

export function CategoriesPage() {
  const { success, error: showError } = useToast()
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })

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
                      <td className="py-3 px-4 text-right">{category.productCount}</td>
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
