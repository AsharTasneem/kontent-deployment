"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HeaderData, NavLink } from "@/kontentClient";

interface HeaderProps {
  header: HeaderData | null;
  locale: string;
  /** Fallback title shown next to logo when logoText is empty */
  fallbackTitle?: string;
  host?: string;
}

/**
 * Render a single nav link based on its linkType:
 * - same_page_scroll → button with scrollIntoView (targets current page only)
 * - external → <a> opening in new tab
 * - internal_page → <Link> to the internal route
 */
function NavLinkItem({ link, locale }: { link: NavLink; locale: string }) {
  const linkClass =
    "nav-link text-[11px] font-medium uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white";

  if (link.linkType === "external_url" && link.externalUrl) {
    return (
      <a
        href={link.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {link.label}
      </a>
    );
  }

  if (link.linkType === "internal_page" && link.internalPageSlug) {
    return (
      <Link href={`/${locale}/${link.internalPageSlug}`} className={linkClass}>
        {link.label}
      </Link>
    );
  }

  // Default: same_page_scroll — scroll to section on the current page
  return (
    <button
      type="button"
      className={linkClass}
      onClick={() => {
        const target = document.getElementById(link.sectionId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }}
    >
      {link.label}
    </button>
  );
}

export default function Header({
  header,
  locale,
  fallbackTitle = "MASAR",
  host = "",
}: HeaderProps) {
  const [clientHost, setClientHost] = useState(host);
  const pathname = usePathname() || "";

  useEffect(() => {
    // On the client, window.location.host is the ultimate source of truth
    if (typeof window !== "undefined") {
      setClientHost(window.location.host);
    }
  }, []);

  const otherLocale = locale === "en" ? "ar" : "en";
  const otherLocaleLabel = locale === "en" ? "عربي" : "EN";
  const currentLocaleLabel = locale === "en" ? "EN" : "عربي";

  const isVercelDomain = clientHost.endsWith(".vercel.app");

  let cleanPath = pathname;
  if (pathname === `/${locale}`) {
    cleanPath = "/";
  } else if (pathname.startsWith(`/${locale}/`)) {
    cleanPath = pathname.replace(`/${locale}/`, "/");
  }

  let currentLocaleUrl = "";
  let otherLocaleUrl = "";
  let logoHref = "";

  if (isVercelDomain) {
    currentLocaleUrl = pathname;
    const pathSuffix = cleanPath === "/" ? "" : cleanPath;
    otherLocaleUrl = `/${otherLocale}${pathSuffix}`;
    logoHref = `/${locale}`;
  } else {
    const protocol = clientHost.includes("localhost") ? "http" : "https";
    const baseDomain = clientHost ? clientHost.replace(/^(en|ar)\./, "") : "";
    
    currentLocaleUrl = clientHost ? `${protocol}://${locale}.${baseDomain}${cleanPath}` : `/${locale}${cleanPath}`;
    otherLocaleUrl = clientHost ? `${protocol}://${otherLocale}.${baseDomain}${cleanPath}` : `/${otherLocale}${cleanPath}`;
    logoHref = "/";
  }

  return (
    <header className="navbar-glass fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo + Language Switcher */}
        <div className="flex items-center gap-8">
          <a
            href={logoHref}
            className="group flex items-center gap-3 transition-colors"
          >
            {/* Logo from CMS */}
            {header?.logoUrl ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/10">
                <Image
                  src={header.logoUrl}
                  alt={header.logoText || "Logo"}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            ) : (
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-(--gold-400)/40 bg-(--gold-400)/10 text-sm font-bold text-(--gold-300)"
                style={{ fontFamily: "var(--font-display)" }}
              >
                M
              </span>
            )}
            <span className="text-base font-semibold tracking-wide text-white/90 transition-colors group-hover:text-white">
              {header?.logoText || fallbackTitle}
            </span>
          </a>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium">
            <a
              href={currentLocaleUrl}
              className="text-(--gold-300) transition-colors hover:text-(--gold-200)"
            >
              {currentLocaleLabel}
            </a>
            <span className="h-3 w-px bg-white/20" />
            <a
              href={otherLocaleUrl}
              className="text-white/50 transition-colors hover:text-white/80"
            >
              {otherLocaleLabel}
            </a>
          </div>
        </div>

        {/* Nav Links from CMS */}
        <nav className="hidden items-center gap-10 md:flex">
          {header?.navLinks &&
            header.navLinks.length > 0 &&
            header.navLinks.map((link, index) => (
              <NavLinkItem
                key={link.sectionId || `nav-${index}`}
                link={link}
                locale={locale}
              />
            ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="group flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="block h-[1.5px] w-6 bg-white/80 transition-all duration-300 group-hover:bg-(--gold-300)" />
          <span className="block h-[1.5px] w-4 bg-white/60 transition-all duration-300 group-hover:w-6 group-hover:bg-(--gold-300)" />
          <span className="block h-[1.5px] w-6 bg-white/80 transition-all duration-300 group-hover:bg-(--gold-300)" />
        </button>
      </div>
    </header>
  );
}
