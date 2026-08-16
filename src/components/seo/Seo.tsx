import { useLocation } from 'react-router-dom'
import { SITE_NAME, seoPages } from '@/config/seo'
import { useSeo } from './useSeo'

export function RouteSeo() {
  const location = useLocation()
  const isProductRoute = location.pathname.startsWith('/product/')
  const config = isProductRoute
    ? {
        title: `Product Details | ${SITE_NAME}`,
        description: 'View product details, availability, pricing, and purchase options at GAM Shop.',
        path: location.pathname,
        type: 'product' as const,
      }
    : seoPages[location.pathname] || {
        title: `Page Not Found | ${SITE_NAME}`,
        description: 'The page you are looking for could not be found on GAM Shop.',
        path: location.pathname,
        noindex: true,
      }

  useSeo(config)
  return null
}

export function SeoJsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script type="application/ld+json">
      {JSON.stringify(data)}
    </script>
  )
}
