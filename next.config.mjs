/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'lumyn.co.ke' }],
        destination: 'https://www.lumyn.co.ke/:path*',
        permanent: true,
      },
    ]
  },
  // Ensure build and type errors are surfaced in CI by not ignoring them.
  eslint: {},
  typescript: {},
  async headers() {
    const headers = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'geolocation=(), camera=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ]

    if (!isDev) {
      headers.push({
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' blob: https://www.googletagmanager.com https://www.google-analytics.com https://www.googleapis.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://vercel.live https://connect.facebook.net https://clerk.lumyn.co.ke https://*.clerk.lumyn.co.ke; worker-src 'self' blob: https://clerk.lumyn.co.ke https://*.clerk.lumyn.co.ke; child-src 'self' blob: https://clerk.lumyn.co.ke https://*.clerk.lumyn.co.ke; connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com https://graph.facebook.com https://www.google-analytics.com https://www.google.com https://stats.g.doubleclick.net https://*.facebook.com https://clerk.lumyn.co.ke https://*.clerk.lumyn.co.ke https://ws-us3.pusher.com; img-src 'self' data: blob: https://img.clerk.com https://res.cloudinary.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.facebook.com https://www.google-analytics.com https://clerk.lumyn.co.ke https://*.clerk.lumyn.co.ke https://vercel.com https://vercel.live; style-src 'self' 'unsafe-inline' https://clerk.lumyn.co.ke https://*.clerk.lumyn.co.ke; font-src 'self' data: https://clerk.lumyn.co.ke https://*.clerk.lumyn.co.ke https://vercel.live; frame-src 'self' https://vercel.live; frame-ancestors 'self';",
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