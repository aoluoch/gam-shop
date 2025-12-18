import { RotateCcw, CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary mb-4">Returns & Refunds</h1>
          <p className="text-muted-foreground">
            Our policy on returns, exchanges, and refunds.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                Return Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <p>
                We want you to be completely satisfied with your purchase. If you're not happy with your order, 
                you may return it within <strong>7 days</strong> of delivery for a refund or exchange.
              </p>
              <p>
                To be eligible for a return, items must be:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Unused and in the same condition as received</li>
                <li>In original packaging</li>
                <li>Accompanied by proof of purchase</li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Eligible for Return
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <ul className="space-y-2">
                  <li>• Defective or damaged items</li>
                  <li>• Wrong item received</li>
                  <li>• Item doesn't match description</li>
                  <li>• Unopened books and accessories</li>
                  <li>• Unworn apparel with tags attached</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Not Eligible for Return
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <ul className="space-y-2">
                  <li>• Items returned after 7 days</li>
                  <li>• Used or worn items</li>
                  <li>• Items without original packaging</li>
                  <li>• Items damaged by customer</li>
                  <li>• Sale or clearance items</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                How to Request a Return
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>Contact us at <strong>gracearenakenya@gmail.com</strong> or call <strong>0759 212574</strong></li>
                <li>Provide your order number and reason for return</li>
                <li>Wait for return authorization and instructions</li>
                <li>Ship the item back or drop it off at our location</li>
                <li>Receive your refund within 5-7 business days after we receive the item</li>
              </ol>
              <p className="text-sm">
                <strong>Note:</strong> Return shipping costs are the responsibility of the customer unless the 
                return is due to our error (wrong item, defective product, etc.).
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need help with a return?{' '}
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
