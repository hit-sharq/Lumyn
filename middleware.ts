import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/about(.*)',
  '/events(.*)',
  '/news(.*)',
  '/blog(.*)',
  '/gallery(.*)',
  '/contact(.*)',
  '/get-started(.*)',
  '/newsletter(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/faq(.*)',
  '/sponsorship(.*)',
  '/projects(.*)',
  '/studio(.*)',
  '/market(.*)',
  '/hire(.*)',
  '/launch(.*)',
  '/creators(.*)',
  '/payment(.*)',
  '/api/news(.*)',
  '/api/blog(.*)',
  '/api/events(.*)',
  '/api/gallery(.*)',
  '/api/leadership(.*)',
  '/api/partners(.*)',
  '/api/projects(.*)',
  '/api/stats(.*)',
  '/api/search(.*)',
  '/api/contact(.*)',
  '/api/project-inquiry(.*)',
  '/api/newsletter(.*)',
  '/api/upload(.*)',
  '/api/studio/templates(.*)',
  '/api/market/products(.*)',
  '/api/hire(.*)',
  '/api/creators(.*)',
  '/api/payments/ipn(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
