import { NextResponse } from 'next/server'

const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://kesa-umn.vercel.app'}/api/sitemap
`

export async function GET() {
  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // cache for 1 day
    },
  })
}
