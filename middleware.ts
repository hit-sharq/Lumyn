import { authMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'

// 1. Define your base Clerk middleware handler instance
const clerkHandler = authMiddleware({
  publicRoutes: [
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
    '/admin(.*)',
    '/partners(.*)',
    '/careers(.*)',
    '/technologies(.*)',
    '/services(.*)',
    '/ai-marketing(.*)',
    '/api/ai-marketing(.*)',
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
    '/api/generate-business-case(.*)',
    '/api/actions/proposal(.*)',
    '/api/notifications(.*)',
    '/api/referrals(.*)',
    '/api/marketing/newsletter(.*)',
    '/api/marketing/sms-blast(.*)',
    '/api/marketing/push-blast(.*)',
    '/api/partners(.*)',
    '/api/service-requests(.*)',
    '/notifications(.*)',
  ],
})

// 2. Intercept the execution to prevent unhandled fatal runtime crashes
export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  try {
    return await clerkHandler(req, event)
  } catch (error: any) {
    // Intercept Clerk's fatal clock-skew exception
    if (error?.message?.includes('Clock skew') || error?.message?.includes('JWT is expired')) {
      console.warn('Middleware intercepted an expired token/clock-skew crash. Clearing response context safely.')
      
      // Let the request bypass to the page fallback or sign-in flow instead of throwing a 500
      const response = NextResponse.next()
      
      // Optional: Clear out the client's problematic session cookie immediately to stop the loop
      response.cookies.delete('__session')
      return response
    }
    
    // Rethrow any unrelated errors so you don't mask other real dev bugs
    throw error
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}