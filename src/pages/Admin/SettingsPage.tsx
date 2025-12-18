import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/useToast'

export function SettingsPage() {
  const { success, error: showError } = useToast()
  const [loading, setLoading] = useState(false)

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'GAM Shop',
    storeEmail: 'info@gamshop.com',
    storePhone: '+254 700 000 000',
    currency: 'KES',
    taxRate: '16',
  })

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: '5000',
    standardShippingRate: '300',
    expressShippingRate: '500',
  })

  async function handleSaveStore(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      // In a real app, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 500))
      success('Store settings saved')
    } catch {
      showError('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveShipping(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      // In a real app, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 500))
      success('Shipping settings saved')
    } catch {
      showError('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your store settings</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveStore} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, storeName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeSettings.storeEmail}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, storeEmail: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storePhone">Store Phone</Label>
                <Input
                  id="storePhone"
                  value={storeSettings.storePhone}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, storePhone: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={storeSettings.currency}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, currency: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="KES">KES (KSh)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    min="0"
                    value={storeSettings.taxRate}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, taxRate: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Settings</CardTitle>
            <CardDescription>Configure shipping rates and options</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveShipping} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (KSh)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  step="0.01"
                  min="0"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(e) =>
                    setShippingSettings({
                      ...shippingSettings,
                      freeShippingThreshold: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Orders above this amount get free shipping
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="standardShippingRate">Standard Shipping (KSh)</Label>
                  <Input
                    id="standardShippingRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={shippingSettings.standardShippingRate}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        standardShippingRate: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expressShippingRate">Express Shipping (KSh)</Label>
                  <Input
                    id="expressShippingRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={shippingSettings.expressShippingRate}
                    onChange={(e) =>
                      setShippingSettings({
                        ...shippingSettings,
                        expressShippingRate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
