import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  breadcrumbJsonLd,
  siteJsonLd,
  type SeoConfig,
} from '@/config/seo'

const managedSelector = 'meta[data-seo="managed"], link[data-seo="managed"], script[data-seo="managed"]'

export function useSeo(config: SeoConfig) {
  const location = useLocation()

  useEffect(() => {
    const title = config.title.includes(SITE_NAME) ? config.title : `${config.title} | ${SITE_NAME}`
    const description = config.description || DEFAULT_DESCRIPTION
    const canonical = absoluteUrl(config.path || location.pathname)
    const image = absoluteUrl(config.image || DEFAULT_OG_IMAGE)
    const type = config.type === 'product' ? 'product' : config.type || 'website'
    const robots = config.noindex ? 'noindex, nofollow' : 'index, follow'
    const jsonLd = [
      ...siteJsonLd(),
      breadcrumbJsonLd(config.path || location.pathname, title),
      ...(Array.isArray(config.jsonLd) ? config.jsonLd : config.jsonLd ? [config.jsonLd] : []),
    ]

    document.title = title
    document.querySelectorAll(managedSelector).forEach((element) => element.remove())

    appendMeta('name', 'description', description)
    appendMeta('name', 'robots', robots)
    appendMeta('property', 'og:site_name', SITE_NAME)
    appendMeta('property', 'og:title', title)
    appendMeta('property', 'og:description', description)
    appendMeta('property', 'og:type', type)
    appendMeta('property', 'og:url', canonical)
    appendMeta('property', 'og:image', image)
    appendMeta('name', 'twitter:card', 'summary_large_image')
    appendMeta('name', 'twitter:title', title)
    appendMeta('name', 'twitter:description', description)
    appendMeta('name', 'twitter:image', image)
    appendLink('canonical', canonical)
    appendJsonLd(jsonLd)
  }, [config, location.pathname])
}

function appendMeta(attribute: 'name' | 'property', key: string, content: string) {
  const meta = document.createElement('meta')
  meta.setAttribute(attribute, key)
  meta.setAttribute('content', content)
  meta.setAttribute('data-seo', 'managed')
  document.head.appendChild(meta)
}

function appendLink(rel: string, href: string) {
  const link = document.createElement('link')
  link.setAttribute('rel', rel)
  link.setAttribute('href', href)
  link.setAttribute('data-seo', 'managed')
  document.head.appendChild(link)
}

function appendJsonLd(data: unknown) {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(data)
  script.setAttribute('data-seo', 'managed')
  document.head.appendChild(script)
}
