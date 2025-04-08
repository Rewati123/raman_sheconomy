import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // If the user is not logged in and trying to access protected routes
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/program') || pathname.startsWith('/user'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If the user is logged in and trying to access login page
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/program/:path*', '/user/:path*']
} 