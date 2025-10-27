import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kesa-umn.vercel.app'

function generateSiteMap(urls: { loc: string; lastmod?: string }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(({ loc, lastmod }) => {
        return `
      <url>
        <loc>${loc}</loc>
        ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>`
      })
      .join('')}
  </urlset>`
}

export async function GET() {
  // Static routes
  const staticUrls = [
    '/',
    '/about',
    '/blog',
    '/contact',
    '/events',
    '/gallery',
    '/membership',
    '/news',
    '/newsletter',
    '/privacy',
    '/sponsorship',
    '/terms',
  ].map((path) => ({
    loc: `${baseUrl}${path}`,
    lastmod: new Date().toISOString(),
  }))

  // Dynamic routes from DB
  const blogs = await prisma.blog.findMany({ select: { id: true, updatedAt: true } })
  const blogUrls = blogs.map((blog) => ({
    loc: `${baseUrl}/blog/${blog.id}`,
    lastmod: blog.updatedAt.toISOString(),
  }))

  const news = await prisma.news.findMany({ select: { id: true, updatedAt: true } })
  const newsUrls = news.map((newsItem) => ({
    loc: `${baseUrl}/news/${newsItem.id}`,
    lastmod: newsItem.updatedAt.toISOString(),
  }))

  const events = await prisma.event.findMany({ select: { id: true, updatedAt: true } })
  const eventUrls = events.map((event) => ({
    loc: `${baseUrl}/events/${event.id}`,
    lastmod: event.updatedAt.toISOString(),
  }))

  const galleries = await prisma.galleryImage.findMany({ select: { id: true, updatedAt: true } })
  const galleryUrls = galleries.map((gallery) => ({
    loc: `${baseUrl}/gallery/${gallery.id}`,
    lastmod: gallery.updatedAt.toISOString(),
  }))

  const allUrls = [...staticUrls, ...blogUrls, ...newsUrls, ...eventUrls, ...galleryUrls]

  const sitemap = generateSiteMap(allUrls)

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
