const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function generateDynamicSitemap() {
  const baseUrl = 'https://kesa-umn.vercel.app'

  // Fetch dynamic routes
  const blogs = await prisma.blog.findMany({ select: { id: true, updatedAt: true } })
  const news = await prisma.news.findMany({ select: { id: true, updatedAt: true } })
  const events = await prisma.event.findMany({ select: { id: true, updatedAt: true } })
  const galleries = await prisma.galleryImage.findMany({ select: { id: true, updatedAt: true } })

  // Build sitemap entries
  const urls = [
    ...blogs.map(b => ({
      loc: `${baseUrl}/blog/${b.id}`,
      lastmod: b.updatedAt.toISOString(),
    })),
    ...news.map(n => ({
      loc: `${baseUrl}/news/${n.id}`,
      lastmod: n.updatedAt.toISOString(),
    })),
    ...events.map(e => ({
      loc: `${baseUrl}/events/${e.id}`,
      lastmod: e.updatedAt.toISOString(),
    })),
    ...galleries.map(g => ({
      loc: `${baseUrl}/gallery/${g.id}`,
      lastmod: g.updatedAt.toISOString(),
    })),
  ]

  // Generate XML sitemap string
  const sitemapEntries = urls.map(({ loc, lastmod }) => `
    <url>
      <loc>${loc}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
  `).join('')

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapEntries}
  </urlset>`

  // Write to public/dynamic-sitemap.xml
  const outputPath = path.join(process.cwd(), 'public', 'dynamic-sitemap.xml')
  fs.writeFileSync(outputPath, sitemapXml, 'utf8')
  console.log('Dynamic sitemap generated at public/dynamic-sitemap.xml')
}

generateDynamicSitemap()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
