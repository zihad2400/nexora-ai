import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { env } from '@/lib/env';

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

const PROTECTED_PAGES = [
  '/dashboard',
  '/chat',
  '/images',
  '/documents',
  '/coding',
  '/voice',
  '/research',
  '/prompts',
  '/settings',
  '/workspaces',
  '/admin',
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(env.COOKIE_NAME)?.value;

  let payload = null;
  if (token) {
    try {
      const { payload: p } = await jwtVerify(token, secretKey, { algorithms: ['HS256'] });
      payload = p;
    } catch {
      payload = null;
    }
  }

  const isProtectedPage = PROTECTED_PAGES.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  const isProtectedApi =
    pathname.startsWith('/api/') &&
    !pathname.startsWith('/api/auth/') &&
    !pathname.startsWith('/api/health');

  if (isProtectedPage && !payload) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin') && payload?.role !== 'admin') {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (isProtectedApi && !payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads).*)'],
};
