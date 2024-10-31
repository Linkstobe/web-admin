import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken');
  
  const isAppRoute = request.nextUrl.pathname.startsWith('/app');
  const isLoginPage = request.nextUrl.pathname === '/';

  if (isAppRoute && !token) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && token) {
    const appUrl = new URL('/app', request.url);
    return NextResponse.redirect(appUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/app/:path*'],
};
