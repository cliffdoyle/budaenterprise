import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  // NextAuth v5 uses 'authjs.session-token' (or __Secure- prefix on HTTPS)
  const secureCookie = req.nextUrl.protocol === 'https:';
  const cookieName = secureCookie ? '__Secure-authjs.session-token' : 'authjs.session-token';

  const token = await getToken({ req, secret, cookieName });
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  if (!token && !isLoginPage) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
