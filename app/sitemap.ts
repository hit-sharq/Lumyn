import { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db/prisma'
import { readdirSync, statSync } from 'fs'
import { join, sep } from 'path'

const MAIN_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lumyn.co.ke'
const PORTFOLIO_BASE_URL = process.env.NEXT_PUBLIC_PORTFOLIO_BASE_URL || 'https://mutukujoshua.lumyn.co.ke'
const APP_DIR = join(process.cwd(), 'app')

export const revalidate = 3600

const EXCLUDED_DIRS = new Set(['api', 'admin', 'studio/admin', '_components', 'components'])

// Routes that are private/auth-gated/dashboards and must never be indexed.
// Kept in sync with the disallow list in app/robots.ts.
const EXCLUDED_PATHS = new Set([
  '/studio/admin',
  '/market/dashboard',
  '/launch/dashboard',
  '/launch/builder',
  '/studio/dashboard',
  '/creators/dashboard',
  '/notifications',
  '/payment',
  '/referrals',
  '/sign-in',
])

const PRIORITY_RULES: Record<string, { priority: number; frequency: 'weekly' | 'monthly' | 'yearly' }> = {
  '/': { priority: 1, frequency: 'weekly' },
  '/ai-marketing': { priority: 0.8, frequency: 'weekly' },
  '/services': { priority: 0.8, frequency: 'monthly' },
  '/studio': { priority: 0.8, frequency: 'weekly' },
  '/launch': { priority: 0.8, frequency: 'weekly' },
  '/market': { priority: 0.8, frequency: 'weekly' },
  '/hire': { priority: 0.8, frequency: 'weekly' },
  '/about': { priority: 0.8, frequency: 'monthly' },
  '/contact': { priority: 0.8, frequency: 'monthly' },
  '/careers': { priority: 0.8, frequency: 'weekly' },
  '/get-started': { priority: 0.8, frequency: 'monthly' },
  '/partners': { priority: 0.8, frequency: 'monthly' },
  '/projects': { priority: 0.8, frequency: 'weekly' },
  '/blog': { priority: 0.8, frequency: 'weekly' },
  '/news': { priority: 0.8, frequency: 'weekly' },
  '/events': { priority: 0.8, frequency: 'weekly' },
  '/privacy': { priority: 0.5, frequency: 'yearly' },
  '/terms': { priority: 0.5, frequency: 'yearly' },
  '/newsletter': { priority: 0.7, frequency: 'monthly' },
  '/sponsorship': { priority: 0.7, frequency: 'monthly' },
  '/gallery': { priority: 0.7, frequency: 'monthly' },
  '/faq': { priority: 0.7, frequency: 'monthly' },
  '/creators': { priority: 0.8, frequency: 'weekly' },
}

function resolveHost(): string {
  try {
    const h = headers()
    const host = h.get('x-forwarded-host') || h.get('host') || ''
    return host.toLowerCase()
  } catch {
    return ''
  }
}

function isPortfolioHost(host: string): boolean {
  if (!host) return false
  const portfolioHost = new URL(PORTFOLIO_BASE_URL).host.toLowerCase()
  return host === portfolioHost
}

async function getLastModified(filePath: string): Promise<Date> {
  try {
    const stats = statSync(filePath)
    return stats.mtime
  } catch {
    return new Date()
  }
}

async function discoverStaticPages(dir: string, baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = []
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return pages
  }

  const hasPage = entries.some((entry) => entry.name === 'page.tsx' || entry.name === 'page.ts')

  if (hasPage) {
    const relativeParts = dir
      .slice(APP_DIR.length)
      .split(sep)
      .filter(Boolean)
      .filter((part) => !part.startsWith('(') && !part.startsWith('['))
    const urlPath = relativeParts.length ? '/' + relativeParts.join('/') : '/'
    const filePath = join(dir, 'page.tsx')
    const lastModified = await getLastModified(filePath)
    const url = urlPath === '/' ? baseUrl : `${baseUrl}${urlPath}`
    const rules = PRIORITY_RULES[urlPath] || { priority: 0.6, frequency: 'monthly' as const }

    if (!EXCLUDED_PATHS.has(urlPath)) {
      pages.push({
        url,
        lastModified,
        changeFrequency: rules.frequency,
        priority: rules.priority,
      })
    }
  }

  for (const entry of entries) {
    if (
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      !entry.name.startsWith('(') &&
      !entry.name.startsWith('[') &&
      !EXCLUDED_DIRS.has(entry.name)
    ) {
      const childPages = await discoverStaticPages(join(dir, entry.name), baseUrl)
      pages.push(...childPages)
    }
  }

  return pages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = resolveHost()
  const isPortfolio = isPortfolioHost(host)
  const baseUrl = isPortfolio ? PORTFOLIO_BASE_URL : MAIN_BASE_URL

  if (isPortfolio) {
    const portfolioUrl: MetadataRoute.Sitemap = [
      {
        url: PORTFOLIO_BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
    ]

    try {
      const portfolios = await prisma.launchPortfolio.findMany({
        where: { isPublished: true },
        select: { username: true, updatedAt: true },
      })
      portfolios.forEach((p) => {
        portfolioUrl.push({
          url: `${PORTFOLIO_BASE_URL}/portfolio/${p.username}`,
          lastModified: p.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      })
    } catch (error) {
      console.error('Error fetching portfolios for sitemap:', error)
    }

    return portfolioUrl
  }

  const staticPages = await discoverStaticPages(APP_DIR, MAIN_BASE_URL)
  const dynamicUrls: MetadataRoute.Sitemap = []

  try {
    const [blogs, news, events, projects, portfolios, templates, marketProducts, careers] = await Promise.all([
      prisma.blog.findMany({ where: { isPublished: true }, select: { id: true, updatedAt: true } }),
      prisma.news.findMany({ select: { id: true, publishedAt: true } }),
      prisma.event.findMany({ select: { id: true, date: true } }),
      prisma.project.findMany({ where: { featured: true }, select: { id: true, updatedAt: true } }),
      prisma.launchPortfolio.findMany({ where: { isPublished: true }, select: { username: true, updatedAt: true } }),
      prisma.studioTemplate.findMany({ where: { isPublished: true }, select: { id: true, updatedAt: true } }),
      prisma.marketProduct.findMany({ where: { isPublished: true }, select: { id: true, updatedAt: true } }),
      prisma.career.findMany({ select: { id: true, updatedAt: true } }),
    ])

    blogs.forEach((blog) => {
      dynamicUrls.push({ url: `${MAIN_BASE_URL}/blog/${blog.id}`, lastModified: blog.updatedAt, changeFrequency: 'monthly', priority: 0.7 })
    })

    news.forEach((item) => {
      dynamicUrls.push({ url: `${MAIN_BASE_URL}/news/${item.id}`, lastModified: item.publishedAt, changeFrequency: 'weekly', priority: 0.7 })
    })

    events.forEach((event) => {
      dynamicUrls.push({ url: `${MAIN_BASE_URL}/events/${event.id}`, lastModified: event.date, changeFrequency: 'weekly', priority: 0.7 })
    })

    projects.forEach((project) => {
      dynamicUrls.push({ url: `${MAIN_BASE_URL}/projects/${project.id}`, lastModified: project.updatedAt, changeFrequency: 'monthly', priority: 0.7 })
    })

    portfolios.forEach((portfolio) => {
      dynamicUrls.push({ url: `${MAIN_BASE_URL}/portfolio/${portfolio.username}`, lastModified: portfolio.updatedAt, changeFrequency: 'weekly', priority: 0.6 })
    })

    templates.forEach((template) => {
      dynamicUrls.push({ url: `${MAIN_BASE_URL}/studio/${template.id}`, lastModified: template.updatedAt, changeFrequency: 'monthly', priority: 0.7 })
    })

    marketProducts.forEach((product) => {
      dynamicUrls.push({ url: `${MAIN_BASE_URL}/market/${product.id}`, lastModified: product.updatedAt, changeFrequency: 'monthly', priority: 0.7 })
    })

    careers.forEach((career) => {
      dynamicUrls.push({ url: `${MAIN_BASE_URL}/careers/${career.id}`, lastModified: career.updatedAt, changeFrequency: 'weekly', priority: 0.8 })
    })
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error)
  }

  return [...staticPages, ...dynamicUrls]
}
