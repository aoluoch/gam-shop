import { createClient } from '@supabase/supabase-js'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')
const siteUrl = normalizeSiteUrl(process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://gracearena.me')
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', priority: '0.9', changefreq: 'daily' },
  { path: '/shop/books', priority: '0.8', changefreq: 'weekly' },
  { path: '/shop/apparel', priority: '0.8', changefreq: 'weekly' },
  { path: '/shop/accessories', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/faq', priority: '0.5', changefreq: 'monthly' },
  { path: '/shipping', priority: '0.5', changefreq: 'monthly' },
  { path: '/returns', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
]

const dynamicRoutes = await getProductRoutes()
const routes = [...staticRoutes, ...dynamicRoutes]

await mkdir(publicDir, { recursive: true })
await writeFile(path.join(publicDir, 'robots.txt'), robotsTxt(siteUrl), 'utf8')
await writeFile(path.join(publicDir, 'sitemap.xml'), sitemapXml(siteUrl, routes), 'utf8')

console.log(`Generated public/sitemap.xml with ${routes.length} URLs`)
console.log(`Generated public/robots.txt for ${siteUrl}`)
if (!dynamicRoutes.length) {
  console.log('No dynamic product URLs were generated. Set Supabase env vars during production build to include active products.')
}

async function getProductRoutes() {
  if (!isUsableEnv(supabaseUrl) || !isUsableEnv(supabaseAnonKey)) {
    return []
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data, error } = await supabase
      .from('products')
      .select('id, updated_at, created_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })

    if (error) throw error

    return (data || [])
      .filter((product) => product.id)
      .map((product) => ({
        path: `/product/${product.id}`,
        lastmod: product.updated_at || product.created_at,
        priority: '0.7',
        changefreq: 'weekly',
      }))
  } catch (error) {
    console.warn(`Could not fetch product routes for sitemap: ${error.message}`)
    return []
  }
}

function sitemapXml(baseUrl, routes) {
  const urls = routes
    .map((route) => {
      const lastmod = route.lastmod || new Date().toISOString()
      return [
        '  <url>',
        `    <loc>${escapeXml(`${baseUrl}${route.path}`)}</loc>`,
        `    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>`,
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${route.priority}</priority>`,
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function robotsTxt(baseUrl) {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /account',
    'Disallow: /account/',
    'Disallow: /orders',
    'Disallow: /orders/',
    'Disallow: /checkout',
    'Disallow: /wishlist',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /forgot-password',
    'Disallow: /reset-password',
    'Disallow: /order-success',
    'Disallow: /*?*',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    '',
  ].join('\n')
}

function normalizeSiteUrl(url) {
  return url.replace(/\/+$/, '')
}

function isUsableEnv(value) {
  return Boolean(value && !value.startsWith('your_') && !value.includes('your-'))
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
