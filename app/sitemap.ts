import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://lumyn.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/newsletter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/sponsorship`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/get-started`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/partners`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/studio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/launch`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/market`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/hire`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/creators`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const dynamicUrls: MetadataRoute.Sitemap = []

  try {
    const [blogs, news, events, projects, portfolios, templates] = await Promise.all([
      prisma.blog.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.news.findMany({
        select: { id: true, publishedAt: true },
      }),
      prisma.event.findMany({
        select: { id: true, date: true },
      }),
      prisma.project.findMany({
        where: { featured: true },
        select: { id: true, updatedAt: true },
      }),
      prisma.launchPortfolio.findMany({
        where: { isPublished: true },
        select: { username: true, updatedAt: true },
      }),
      prisma.studioTemplate.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
      }),
    ])

    blogs.forEach((blog) => {
      dynamicUrls.push({
        url: `${BASE_URL}/blog/${blog.id}`,
        lastModified: blog.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })

    news.forEach((item) => {
      dynamicUrls.push({
        url: `${BASE_URL}/news/${item.id}`,
        lastModified: item.publishedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })

    events.forEach((event) => {
      dynamicUrls.push({
        url: `${BASE_URL}/events/${event.id}`,
        lastModified: event.date,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })

    projects.forEach((project) => {
      dynamicUrls.push({
        url: `${BASE_URL}/projects/${project.id}`,
        lastModified: project.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })

    portfolios.forEach((portfolio) => {
      dynamicUrls.push({
        url: `${BASE_URL}/portfolio/${portfolio.username}`,
        lastModified: portfolio.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    })

    templates.forEach((template) => {
      dynamicUrls.push({
        url: `${BASE_URL}/studio/${template.id}`,
        lastModified: template.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error)
  }

  return [...staticPages, ...dynamicUrls]
}