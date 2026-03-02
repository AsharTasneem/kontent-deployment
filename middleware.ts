import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname, search } = nextUrl;

  // 1️⃣ Skip internal, static, API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Get hostname safely
  const host = request.headers.get('host') ?? '';

  // ============== SUBDOMAIN ROUTING (Custom Domains & Localhost) ================
  let subdomain = '';
  
  if (host.includes('localhost')) {
    // If it's explicitly 'localhost:3000' with no subdomain, redirect to en.localhost:3000
    if (host === 'localhost:3000' || host === 'localhost') {
      const redirectUrl = new URL(`http://${defaultLocale}.${host}${pathname}${search}`);
      return NextResponse.redirect(redirectUrl);
    }
    
    // localhost case
    subdomain = host.split('.')[0].replace(':3000', '');
  } else {
    // production case (Custom Domain)
    const parts = host.split('.');
    
    // Check if the first part is a known locale ('en' or 'ar')
    if (locales.includes(parts[0])) {
      subdomain = parts[0];
    } else {
      // It's a root domain like `yourwebsite.com`
      // We do not want to force a redirect to the default locale's subdomain.
      // Simply default it to empty so it gets assigned `defaultLocale` below.
      subdomain = '';
    }
  }

  const locale = locales.includes(subdomain) ? subdomain : defaultLocale;

  // 3️⃣ Remove existing locale from path (if present)
  let cleanPath = pathname;

  for (const loc of locales) {
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) {
      // Rewrite to an explicitly non-existent child path (e.g. /en/404)
      // to let Next.js naturally fall through to its default 404 error page.
      // (Because subdomain users shouldn't access path locale)
      return NextResponse.rewrite(new URL(`/${locale}/404`, request.url));
    }
  }

  // 4️⃣ Prevent infinite rewrite
  if (pathname.startsWith(`/${locale}`)) {
    return NextResponse.next();
  }

  // 5️⃣ Rewrite to internal locale path
  const rewriteUrl = new URL(
    `/${locale}${cleanPath === '/' ? '' : cleanPath}${search}`,
    request.url
  );

  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
