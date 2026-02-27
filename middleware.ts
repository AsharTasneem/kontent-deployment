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

  // 2️⃣ Get hostname safely (Check x-forwarded-host first, Vercel/proxies use this)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';

  /**
   * HOST EXAMPLES:
   * en.kontent-ai-demo.vercel.app
   * ar.kontent-ai-demo.vercel.app
   * localhost:3000
   * en.localhost:3000  (after hosts file setup)
   */

  let subdomain = '';
  
  if (host.includes('localhost')) {
    // If it's explicitly 'localhost:3000' with no subdomain, redirect to en.localhost:3000
    if (host === 'localhost:3000' || host === 'localhost') {
      const redirectUrl = new URL(`http://en.${host}${pathname}${search}`);
      return NextResponse.redirect(redirectUrl);
    }
    
    // localhost case
    subdomain = host.split('.')[0].replace(':3000', '');
  } else {
    // production case
    subdomain = host.split('.')[0];
  }

  const locale = locales.includes(subdomain) ? subdomain : defaultLocale;

  // 3️⃣ Remove existing locale from path (if present)
  let cleanPath = pathname;

  for (const loc of locales) {
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) {
      // Rewrite to an explicitly non-existent child path (e.g. /en/404)
      // to let Next.js naturally fall through to its default 404 error page.
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
