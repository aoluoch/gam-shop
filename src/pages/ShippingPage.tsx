import { Truck, Clock, MapPin, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary mb-4">Shipping Information</h1>
          <p className="text-muted-foreground">
            Everything you need to know about our delivery services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Delivery Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>We deliver throughout Kenya. Our primary delivery areas include:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Nairobi and surrounding areas</li>
                <li>Mombasa</li>
                <li>Kisumu</li>
                <li>Nakuru</li>
                <li>All major towns in Kenya</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Delivery Times
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <ul className="space-y-2">
                <li><strong>Nairobi:</strong> 1-3 business days</li>
                <li><strong>Major towns:</strong> 3-5 business days</li>
                <li><strong>Remote areas:</strong> 5-7 business days</li>
              </ul>
              <p className="mt-2 text-sm">
                Delivery times may vary during peak seasons or holidays.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Pickup Option
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>You can also pick up your order from our location:</p>
              <p className="mt-2 font-medium">
                Bungoma Road, off Baricho Road, Nairobi, Kenya
              </p>
              <p className="mt-2 text-sm">
                Please wait for confirmation before coming to pick up your order.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Shipping Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Shipping costs are calculated at checkout based on:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Your delivery location</li>
                <li>Order weight and size</li>
                <li>Delivery speed selected</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">
            Have questions about shipping?{' '}
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
