import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked 'async' if using 'await' inside
export function middleware(request: NextRequest) {
  // Clone the request headers to set a new header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-next-pathname', request.nextUrl.pathname);

  // Get the session token from cookies
  const sessionCookie = request.cookies.get('firebase-session'); // This is a placeholder name

  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/profile'];

  // If trying to access a protected route without a session, redirect to login
  if (protectedRoutes.some(path => pathname.startsWith(path)) && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is logged in (has a session cookie) and tries to access login/register, redirect to profile
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && sessionCookie) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Continue with the request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
