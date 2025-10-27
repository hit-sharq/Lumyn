import { prisma } from '@/lib/prisma'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kesa-umn.vercel.app'

  // Fetch dynamic data from your database
  const blogs = await prisma.blog.findMany({ select: { id: true, updatedAt: true } })
  const news = await prisma.news.findMany({ select: { id: true, updatedAt: true } })
  const events = await prisma.event.findMany({ select: { id: true, updatedAt: true } })
  const galleries = await prisma.galleryImage.findMany({ select: { id: true, updatedAt: true } })

  // Convert data to sitemap entries
  const dynamicRoutes = [
    ...blogs.map(b => ({
      url: `${baseUrl}/blog/${b.id}`,
      lastModified: b.updatedAt,
    })),
    ...news.map(n => ({
      url: `${baseUrl}/news/${n.id}`,
      lastModified: n.updatedAt,
    })),
    ...events.map(e => ({
      url: `${baseUrl}/events/${e.id}`,
      lastModified: e.updatedAt,
    })),
    ...galleries.map(g => ({
      url: `${baseUrl}/gallery/${g.id}`,
      lastModified: g.updatedAt,
    })),
  ]

  // Add static pages
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/events',
    '/gallery',
    '/news',
    '/blog',
    '/membership',
    '/privacy',
    '/terms',
    '/sponsorship',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }))

  return [...staticRoutes, ...dynamicRoutes]
}
