import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // request.cookies.get() est synchrone en Edge runtime (ne pas utiliser await cookies())
  const token = request.cookies.get('access_token')

  if (!token) {
    const url = new URL('/', request.url)
    url.searchParams.set('authRequired', 'true')
    url.searchParams.set('returnTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/projects',
    '/account',
    '/account/:path*',
    '/gallery',
    '/events',
    '/forge',
  ],
}
