import { useState } from 'react'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SIZES, COLORS, type VariantFormData } from '@/types/product'
import { cn } from '@/lib/utils'

interface VariantManagerProps {
  variants: VariantFormData[]
  onVariantsChange: (variants: VariantFormData[]) => void
  className?: string
}

export function VariantManager({
  variants,
  onVariantsChange,
  className,
}: VariantManagerProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(() => 
    [...new Set(variants.map(v => v.size))]
  )
  const [selectedColors, setSelectedColors] = useState<string[]>(() =>
    [...new Set(variants.map(v => v.color))]
  )
  const [showBulkAdd, setShowBulkAdd] = useState(false)
  const [bulkStock, setBulkStock] = useState(10)

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        // Remove size and related variants
        const newSizes = prev.filter(s => s !== size)
        const newVariants = variants.filter(v => v.size !== size)
        onVariantsChange(newVariants)
        return newSizes
      }
      return [...prev, size]
    })
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        // Remove color and related variants
        const newColors = prev.filter(c => c !== color)
        const newVariants = variants.filter(v => v.color !== color)
        onVariantsChange(newVariants)
        return newColors
      }
      return [...prev, color]
    })
  }

  const generateVariants = () => {
    const newVariants: VariantFormData[] = []
    
    for (const size of selectedSizes) {
      for (const color of selectedColors) {
        const existing = variants.find(v => v.size === size && v.color === color)
        if (existing) {
          newVariants.push(existing)
        } else {
          newVariants.push({
            size,
            color,
            stock: bulkStock,
            skuSuffix: `${size}-${color.toUpperCase().slice(0, 3)}`,
          })
        }
      }
    }
    
    onVariantsChange(newVariants)
    setShowBulkAdd(false)
  }

  const updateVariantStock = (size: string, color: string, stock: number) => {
    const newVariants = variants.map(v => {
      if (v.size === size && v.color === color) {
        return { ...v, stock: Math.max(0, stock) }
      }
      return v
    })
    onVariantsChange(newVariants)
  }

  const removeVariant = (size: string, color: string) => {
    const newVariants = variants.filter(v => !(v.size === size && v.color === color))
    onVariantsChange(newVariants)
  }

  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
  const outOfStockCount = variants.filter(v => v.stock === 0).length

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Product Variants</span>
          <span className="text-sm font-normal text-muted-foreground">
            Total Stock: {totalStock}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Size Selection */}
        <div className="space-y-2">
          <Label>Available Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium border transition-colors',
                  selectedSizes.includes(size)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-input'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-2">
          <Label>Available Colors</Label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium border transition-colors flex items-center gap-2',
                  selectedColors.includes(color)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted border-input'
                )}
              >
                <span
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Variants */}
        {selectedSizes.length > 0 && selectedColors.length > 0 && (
          <div className="space-y-3">
            {!showBulkAdd ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBulkAdd(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Variants ({selectedSizes.length} sizes × {selectedColors.length} colors)
              </Button>
            ) : (
              <div className="flex items-end gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="bulkStock">Default Stock per Variant</Label>
                  <Input
                    id="bulkStock"
                    type="number"
                    min="0"
                    value={bulkStock}
                    onChange={(e) => setBulkStock(Number(e.target.value))}
                  />
                </div>
                <Button type="button" onClick={generateVariants}>
                  Generate {selectedSizes.length * selectedColors.length} Variants
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowBulkAdd(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Variants Table */}
        {variants.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Stock by Variant</Label>
              {outOfStockCount > 0 && (
                <span className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {outOfStockCount} out of stock
                </span>
              )}
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Size</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Color</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">Stock</th>
                    <th className="py-2 px-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => (
                    <tr key={`${variant.size}-${variant.color}`} className={cn(
                      'border-t',
                      variant.stock === 0 && 'bg-amber-50 dark:bg-amber-950/20'
                    )}>
                      <td className="py-2 px-3 text-sm font-medium">{variant.size}</td>
                      <td className="py-2 px-3 text-sm">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: variant.color.toLowerCase() }}
                          />
                          {variant.color}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) => updateVariantStock(variant.size, variant.color, Number(e.target.value))}
                          className={cn(
                            'w-20 h-8 text-right ml-auto',
                            variant.stock === 0 && 'border-amber-500'
                          )}
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(variant.size, variant.color)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Add */}
        {selectedSizes.length > 0 && selectedColors.length > 0 && variants.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Click on a size and color above to toggle. Missing variants can be added by generating again.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
