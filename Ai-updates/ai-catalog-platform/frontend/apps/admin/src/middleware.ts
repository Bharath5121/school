import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register'];
const STATIC_PREFIXES = ['/_next', '/favicon.ico', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (STATIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) return NextResponse.next();
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))) return NextResponse.next();
  if (pathname === '/') return NextResponse.next();

  const refreshToken = request.cookies.get('refreshToken');
  if (!refreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
