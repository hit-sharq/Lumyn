import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/events(.*)",
  "/news(.*)",
  "/blog(.*)",
  "/gallery",
  "/contact",
  "/get-started",
  "/newsletter",
  "/privacy",
  "/terms",
  "/sign-in(.*)",
  "/sign-up(.*)",
])

// Public API routes - these allow unauthenticated access for specific operations
function isPublicApiRoute(request: Request): boolean {
  const url = new URL(request.url)
  const pathname = url.pathname
  const method = request.method

  // Public GET routes for content display
  if (method === 'GET') {
    return [
      '/api/news',
      '/api/blog',
      '/api/events',
      '/api/gallery',
      '/api/leadership',
      '/api/partners',
      '/api/projects',
      '/api/stats',
      '/api/search'
    ].some(route => pathname.startsWith(route))
  }


  // Public POST routes for form submissions
  if (method === 'POST') {
    return [
      '/api/contact',
      '/api/project-inquiry',
      '/api/newsletter',
      '/api/job-applications',
      '/api/upload',
      '/api/blog',
      '/api/news',
      '/api/events',
      '/api/gallery'
    ].some(route => pathname.startsWith(route))
  }

  // Public PUT routes for admin updates
  if (method === 'PUT') {
    return [
      '/api/blog',
      '/api/news',
      '/api/events',
      '/api/gallery'
    ].some(route => pathname.startsWith(route))
  }

  // Public DELETE routes for admin deletions
  if (method === 'DELETE') {
    return [
      '/api/blog',
      '/api/news',
      '/api/events',
      '/api/gallery'
    ].some(route => pathname.startsWith(route))
  }

  return false
}

// Simple in-memory rate limiter
const rateLimitMap = new Map()

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 100

function rateLimit(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("remote-address") || "unknown"
  const now = Date.now()

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, startTime: now })
    return true
  }

  const rateData = rateLimitMap.get(ip)

  if (now - rateData.startTime > RATE_LIMIT_WINDOW_MS) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, startTime: now })
    return true
  }

  if (rateData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }

  rateData.count++
  rateLimitMap.set(ip, rateData)
  return true
}


export default clerkMiddleware(async (auth, request) => {
  // Apply rate limiting
  if (!rateLimit(request)) {
    return new Response("Too many requests", { status: 429 })
  }

  // Check if route is public
  const url = new URL(request.url)
  
  // Check for API routes with method-based access control
  if (url.pathname.startsWith('/api/')) {
    if (!isPublicApiRoute(request)) {
      await auth.protect()
    }
  } else {
    // Check for regular pages
    if (!isPublicRoute(request)) {
      await auth.protect()
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
