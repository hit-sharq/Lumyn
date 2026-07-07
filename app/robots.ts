import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lumyn.co.ke'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/studio/admin/',
          '/api/',
          '/_next/',
          '/market/dashboard/',
          '/launch/dashboard/',
          '/launch/builder/',
          '/studio/dashboard/',
          '/creators/dashboard/',
          '/notifications/',
          '/payment/',
          '/referrals/',
          '/sign-in/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}