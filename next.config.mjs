/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  // Ensure build and type errors are surfaced in CI by not ignoring them.
  eslint: {},
  typescript: {},
  async headers() {
    const headers = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'geolocation=(), camera=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ]

    if (!isDev) {
      headers.push({
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleapis.com; connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com https://graph.facebook.com; img-src 'self' data: https://res.cloudinary.com; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'",
      })
    }

    return [
      {
        source: '/(.*)',
        headers,
      },
    ]
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
}

export default nextConfig
