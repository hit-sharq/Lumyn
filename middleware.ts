import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/events',
  '/news',
  '/blog',
  '/gallery',
  '/contact',
  '/get-started',
  '/newsletter',
  '/privacy',
  '/terms',
  '/sign-in',
  '/sign-up',
  '/faq',
  '/sponsorship',
  '/projects',
];

// Public API routes
const PUBLIC_API_ROUTES = [
  '/api/news',
  '/api/blog',
  '/api/events',
  '/api/gallery',
  '/api/leadership',
  '/api/partners',
  '/api/projects',
  '/api/stats',
  '/api/search',
  '/api/contact',
  '/api/project-inquiry',
  '/api/newsletter',
  '/api/upload',
  '/api/studio/templates',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow all public routes
  const isPublic = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Allow all public API routes
  const isPublicApi = PUBLIC_API_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicApi) {
    return NextResponse.next();
  }

  // For protected routes, just pass through - Clerk will handle auth at the page/API level
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
