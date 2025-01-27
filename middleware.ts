import { decodeJwt } from 'jose';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Allow direct access to files in the public directory and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.') ||
    request.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('JWT_TOKEN')?.value;

  const publicRoutes = ['/', '/login'];

  if (publicRoutes.includes(request.nextUrl.pathname)) {
    if (token) {
      try {
        const payload = decodeJwt(token) as { roles?: string[] };

        // If user has 'signup' role, allow access to signup page
        if (payload.roles?.includes('signup')) {
          return NextResponse.redirect(new URL('/signup', request.url));
        }

        // Otherwise, redirect to dashboard/tickets
        if (
          payload.roles?.includes('team') ||
          payload.roles?.includes('sys_admin')
        ) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/tickets', request.url));
        }
      } catch (error) {
        console.error('Error decoding JWT:', error);
        // If JWT is invalid, clear the cookie and allow access to public route
        const response = NextResponse.next();
        response.cookies.delete('JWT_TOKEN');
        return response;
      }
    }

    // If no token, allow access to public routes
    return NextResponse.next();
  }

  // For protected routes (including /signup)
  if (token) {
    try {
      const payload = decodeJwt(token) as { roles?: string[] };

      // If user has 'signup' role and is not on signup page, redirect to signup
      if (
        payload.roles?.includes('signup') &&
        request.nextUrl.pathname !== '/signup'
      ) {
        return NextResponse.redirect(new URL('/signup', request.url));
      }

      // If user doesn't have 'signup' role and tries to access signup page, redirect to dashboard
      if (
        !payload.roles?.includes('signup') &&
        request.nextUrl.pathname === '/signup'
      ) {
        if (
          payload.roles?.includes('team') ||
          payload.roles?.includes('sys_admin')
        ) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/tickets', request.url));
        }
      }

      // Restrict access to /dashboard unless the user has 'team' role
      if (
        request.nextUrl.pathname.startsWith('/dashboard') &&
        !payload.roles?.includes('team')
      ) {
        return NextResponse.redirect(new URL('/tickets', request.url));
      }

      // Restrict access to /settings and its subpages unless the user has 'sys_admin' role
      if (
        request.nextUrl.pathname.startsWith('/settings') &&
        !payload.roles?.includes('sys_admin')
      ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Otherwise, allow access to protected route
      return NextResponse.next();
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  }

  // If no token or invalid token, redirect to login
  const loginUrl = new URL('/', request.url);
  loginUrl.searchParams.set('session_expired', 'true');
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
