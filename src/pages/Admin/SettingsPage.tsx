import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/useToast'
import { supabase } from '@/services/supabase'

export function SettingsPage() {
  const { success, error: showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(true)

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

  // Load settings from database on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - that's okay, we'll use defaults
          console.error('Error loading settings:', error)
          showError('Failed to load settings')
        } else if (data) {
          setStoreSettings({
            storeName: data.store_name || 'GAM Shop',
            storeEmail: data.store_email || 'info@gamshop.com',
            storePhone: data.store_phone || '+254 700 000 000',
            currency: data.currency || 'KES',
            taxRate: data.tax_rate ? String(data.tax_rate) : '16',
          })

          setShippingSettings({
            freeShippingThreshold: data.free_shipping_threshold
              ? String(data.free_shipping_threshold)
              : '5000',
            standardShippingRate: data.standard_shipping_rate
              ? String(data.standard_shipping_rate)
              : '300',
            expressShippingRate: data.express_shipping_rate
              ? String(data.express_shipping_rate)
              : '500',
          })
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        showError('Failed to load settings')
      } finally {
        setLoadingSettings(false)
      }
    }

    loadSettings()
  }, [showError])

  async function handleSaveStore(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      // Get existing settings ID if it exists
      const { data: existing } = await supabase
        .from('store_settings')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      const updateData = {
        store_name: storeSettings.storeName,
        store_email: storeSettings.storeEmail,
        store_phone: storeSettings.storePhone,
        currency: storeSettings.currency,
        tax_rate: parseFloat(storeSettings.taxRate) || 0,
      }

      let error
      if (existing?.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('store_settings')
          .update(updateData)
          .eq('id', existing.id)
        error = updateError
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('store_settings')
          .insert(updateData)
        error = insertError
      }

      if (error) {
        throw error
      }

      success('Store settings saved successfully')
    } catch (error: any) {
      console.error('Error saving store settings:', error)
      showError(error?.message || 'Failed to save store settings')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveShipping(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      // Get existing settings ID if it exists
      const { data: existing } = await supabase
        .from('store_settings')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      const updateData = {
        free_shipping_threshold: parseFloat(shippingSettings.freeShippingThreshold) || 0,
        standard_shipping_rate: parseFloat(shippingSettings.standardShippingRate) || 0,
        express_shipping_rate: parseFloat(shippingSettings.expressShippingRate) || 0,
      }

      let error
      if (existing?.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('store_settings')
          .update(updateData)
          .eq('id', existing.id)
        error = updateError
      } else {
        // Insert new record with default store settings
        const { error: insertError } = await supabase.from('store_settings').insert({
          ...updateData,
          store_name: storeSettings.storeName,
          store_email: storeSettings.storeEmail,
          store_phone: storeSettings.storePhone,
          currency: storeSettings.currency,
          tax_rate: parseFloat(storeSettings.taxRate) || 0,
        })
        error = insertError
      }

      if (error) {
        throw error
      }

      success('Shipping settings saved successfully')
    } catch (error: any) {
      console.error('Error saving shipping settings:', error)
      showError(error?.message || 'Failed to save shipping settings')
    } finally {
      setLoading(false)
    }
  }

  if (loadingSettings) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your store settings</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
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
