/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://kesa-umn.vercel.app',
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    // Since importing prisma in next-sitemap.config.js causes issues,
    // we will return only static paths here.
    // Dynamic routes sitemap generation will need a custom script or API.

    const staticPaths = [
      '',
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
      '/terms'
    ]

    return staticPaths.map(path => ({
      loc: path,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }))
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://kesa-umn.vercel.app/dynamic-sitemap.xml',
    ],
  },
}
