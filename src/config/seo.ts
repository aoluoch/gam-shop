import type { Product } from '@/types/product'

export const SITE_URL = normalizeSiteUrl(
  import.meta.env.VITE_SITE_URL || 'https://gracearena.me',
)

export const SITE_NAME = 'GAM Shop'
export const ORGANIZATION_NAME = 'Grace Arena Ministries'
export const DEFAULT_DESCRIPTION =
  'Shop Christian books, apparel, and accessories from Grace Arena Ministries in Kenya.'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.svg`

export type SeoConfig = {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export const seoPages: Record<string, SeoConfig> = {
  '/': {
    title: 'GAM Shop | Christian Books, Apparel & Accessories',
    description:
      'Discover Christian books by Apostle David Owusu and Rev. Dr. Eunice Owusu, ministry apparel, and faith-inspired accessories.',
    path: '/',
  },
  '/shop': {
    title: 'Shop Christian Books, Apparel & Accessories | GAM Shop',
    description:
      'Browse all GAM Shop products including Christian books, T-shirts, caps, rubber bands, and ministry accessories.',
    path: '/shop',
  },
  '/shop/books': {
    title: 'Christian Books | GAM Shop',
    description:
      'Shop spiritual books and teachings by Apostle David Owusu and Rev. Dr. Eunice Owusu.',
    path: '/shop/books',
  },
  '/shop/apparel': {
    title: 'Christian Apparel | GAM Shop',
    description:
      'Shop Grace Arena Ministries apparel including T-shirts in available sizes and colors.',
    path: '/shop/apparel',
  },
  '/shop/accessories': {
    title: 'Christian Accessories | GAM Shop',
    description:
      'Shop faith-inspired accessories including caps, rubber bands, and ministry items from GAM Shop.',
    path: '/shop/accessories',
  },
  '/about': {
    title: 'About GAM Shop | Grace Arena Ministries',
    description:
      'Learn about GAM Shop, the official store supporting Grace Arena Ministries outreach and community work.',
    path: '/about',
  },
  '/contact': {
    title: 'Contact GAM Shop | Grace Arena Ministries',
    description:
      'Contact GAM Shop for product questions, ministry inquiries, shipping help, and customer support in Kenya.',
    path: '/contact',
  },
  '/faq': {
    title: 'Frequently Asked Questions | GAM Shop',
    description:
      'Find answers about ordering, M-Pesa payments, delivery, returns, and customer support at GAM Shop.',
    path: '/faq',
  },
  '/shipping': {
    title: 'Shipping Information | GAM Shop',
    description:
      'Learn about GAM Shop delivery areas, timelines, pickup location, and shipping costs across Kenya.',
    path: '/shipping',
  },
  '/returns': {
    title: 'Returns & Refunds | GAM Shop',
    description:
      'Read the GAM Shop return, exchange, and refund policy for books, apparel, and accessories.',
    path: '/returns',
  },
  '/privacy': {
    title: 'Privacy Policy | GAM Shop',
    description:
      'Read how GAM Shop collects, uses, and protects customer information for orders and account services.',
    path: '/privacy',
  },
  '/terms': {
    title: 'Terms and Conditions | GAM Shop',
    description:
      'Review the terms and conditions for using GAM Shop and purchasing products from Grace Arena Ministries.',
    path: '/terms',
  },
  '/cart': {
    title: 'Shopping Cart | GAM Shop',
    description: 'Review the Christian books, apparel, and accessories in your GAM Shop cart.',
    path: '/cart',
    noindex: true,
  },
}

export function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, '')
}

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalizedPath}`
}

export function productSeo(product: Product): SeoConfig {
  const description = truncateDescription(
    product.description ||
      `Shop ${product.name} from GAM Shop, the official store of Grace Arena Ministries.`,
  )
  const image = product.thumbnail || product.images[0] || DEFAULT_OG_IMAGE

  return {
    title: `${product.name} | GAM Shop`,
    description,
    path: `/product/${product.id}`,
    image,
    type: 'product',
    jsonLd: productJsonLd(product, image),
  }
}

export function siteJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: ORGANIZATION_NAME,
      url: SITE_URL,
      logo: DEFAULT_OG_IMAGE,
      email: 'gracearenakenya@gmail.com',
      telephone: '+254759212574',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Bungoma Road, off Baricho Road',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/shop?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]
}

export function breadcrumbJsonLd(pathname: string, title?: string) {
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  const segments = cleanPath.split('/').filter(Boolean)
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    ...segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`
      return {
        '@type': 'ListItem',
        position: index + 2,
        name: index === segments.length - 1 && title ? title.replace(` | ${SITE_NAME}`, '') : labelFromSegment(segment),
        item: absoluteUrl(path),
      }
    }),
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

function productJsonLd(product: Product, image: string) {
  const availability = product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/product/${product.id}#product`,
    name: product.name,
    description: truncateDescription(product.description, 300),
    image: absoluteUrl(image),
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    category: product.category,
    ...(product.author
      ? {
          author: {
            '@type': 'Person',
            name: product.author,
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: 'KES',
      price: product.price.toFixed(2),
      availability,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
  }
}

function truncateDescription(value: string, maxLength = 155) {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1).trim()}...`
}

function labelFromSegment(segment: string) {
  if (segment.length > 20 && segment.includes('-')) return 'Product'
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
