import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  
  const isAuthenticated = session?.value === 'authenticated';
  const isLoginPage = request.nextUrl.pathname === '/login';

  // If trying to access admin routes without authentication
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      // Only redirect GET requests to login
      if (request.method !== 'GET') {
        return new NextResponse(null, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If trying to access login while already authenticated
  if (isLoginPage && isAuthenticated) {
    // Only redirect GET requests to admin
    if (request.method !== 'GET') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
