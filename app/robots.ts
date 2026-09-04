import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

const MAIN_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.lumyn.co.ke'
const PORTFOLIO_BASE_URL = process.env.NEXT_PUBLIC_PORTFOLIO_BASE_URL || 'https://mutukujoshua.lumyn.co.ke'

function resolveHost(): string {
  try {
    const h = headers()
    const host = h.get('x-forwarded-host') || h.get('host') || ''
    return host.toLowerCase()
  } catch {
    return ''
  }
}

export default function robots(): MetadataRoute.Robots {
  const host = resolveHost()
  const isPortfolio = host === new URL(PORTFOLIO_BASE_URL).host.toLowerCase()
  const baseUrl = isPortfolio ? PORTFOLIO_BASE_URL : MAIN_BASE_URL

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
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
