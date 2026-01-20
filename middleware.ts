import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/discovery',
  '/creators',
];

// Dynamic public routes patterns
const publicPatterns = [
  /^\/profile\/[^\/]+$/,  // /profile/[slug]
  /^\/projects\/[^\/]+$/, // /projects/[slug] - public project viewing
];

// Routes that should never be processed by middleware
const excludedRoutes = [
  '/api/',
  '/_next/',
  '/favicon.ico',
  '/logo.png',
  '/manifest.json',
];

function isPublicRoute(pathname: string): boolean {
  // Check exact matches
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  // Check pattern matches
  for (const pattern of publicPatterns) {
    if (pattern.test(pathname)) {
      return true;
    }
  }

  return false;
}

function isExcludedRoute(pathname: string): boolean {
  return excludedRoutes.some(route => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for excluded routes
  if (isExcludedRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for access token cookie
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;

  // Public routes - allow access regardless of auth status
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Protected routes - redirect to home if not authenticated
  // The auth modal will be shown on the client side
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('authRequired', 'true');
    url.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
