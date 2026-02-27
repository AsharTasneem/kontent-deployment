import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Skip internal, static, API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Check if the pathname already has a supported locale
  // Example: /en/about or /ar
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 3️⃣ Check for locale subdomains (e.g., en.localhost:3000 or ar.domain.com)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const subdomainMatch = host.match(/^(en|ar)\./);

  if (subdomainMatch) {
    const locale = subdomainMatch[1];
    // Rewrite silently, keeping the subdomain in the URL but serving the locale path
    return NextResponse.rewrite(new URL(`/${locale}${pathname}`, request.url));
  }

  // 4️⃣ If neither path nor subdomain has a locale, redirect to the default locale in path
  // E.g. mysite.com/about -> mysite.com/en/about
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
