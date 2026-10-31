import { type NextRequest, NextResponse } from "next/server";

import { i18nConfig, isSupportedLocale } from "@/i18n/config";

// Paths that must never be intercepted or redirected
const EXCLUDED_PREFIXES = [
  "/api",
  "/_next",
  "/_vercel",
  "/icons",
  "/images",
  "/sw.js",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/opengraph-image",
  "/twitter-image",
  "/favicon.ico",
];

const STATIC_EXTENSIONS_REGEX = /\.(.*)$/;

export function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;

  // 1. Skip system, static, metadata, and API endpoints
  if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 2. Skip files with static extensions (.ico, .png, .jpg, .svg, .js, .css, etc.)
  if (STATIC_EXTENSIONS_REGEX.test(pathname)) {
    return NextResponse.next();
  }

  // 3. When i18n is disabled:
  // Behave as a single-language application. No redirects, no locale prefixes.
  // Rewrite internally to /[defaultLocale] so App Router [lang] handles rendering cleanly.
  if (!i18nConfig.enabled) {
    if (pathname.startsWith(`/${i18nConfig.defaultLocale}`)) {
      // Clean redirect if user tries to hit /en when disabled
      const clean = pathname.replace(`/${i18nConfig.defaultLocale}`, "") || "/";
      return NextResponse.redirect(new URL(`${clean}${search}`, request.url), { status: 308 });
    }
    const rewriteUrl = new URL(
      `/${i18nConfig.defaultLocale}${pathname === "/" ? "" : pathname}${search}`,
      request.url,
    );
    return NextResponse.rewrite(rewriteUrl);
  }

  // 4. When i18n is enabled:
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  const hasSupportedLocale = Boolean(firstSegment && isSupportedLocale(firstSegment));
  const isDefaultLocaleSegment = firstSegment === i18nConfig.defaultLocale;

  // 4A. Strategy: "as-needed" (Recommended default)
  // - Default locale should NEVER have a prefix in canonical public URLs.
  //   If request is /en or /en/privacy, permanently 308 redirect to / or /privacy.
  // - Non-default locales MUST have their prefix (e.g. /es, /es/privacy).
  // - Unprefixed paths (e.g. /, /privacy) resolve to default locale via internal rewrite.
  if (i18nConfig.localePrefix === "as-needed") {
    if (isDefaultLocaleSegment) {
      // Strip default locale prefix and redirect publicly to clean URL
      const remainingSegments = segments.slice(1);
      const targetPath = remainingSegments.length > 0 ? `/${remainingSegments.join("/")}` : "/";
      const redirectUrl = new URL(`${targetPath}${search}`, request.url);
      return NextResponse.redirect(redirectUrl, { status: 308 });
    }

    if (hasSupportedLocale) {
      // Non-default locale (e.g. /es/...) -> pass through cleanly
      return NextResponse.next();
    }

    // Unprefixed route (e.g. /, /privacy) -> internally rewrite to /[defaultLocale]/...
    // The browser URL remains clean (e.g. /privacy) while Next.js routes to /[lang]
    const rewriteUrl = new URL(
      `/${i18nConfig.defaultLocale}${pathname === "/" ? "" : pathname}${search}`,
      request.url,
    );
    return NextResponse.rewrite(rewriteUrl);
  }

  // 4B. Strategy: "always"
  // - EVERY locale MUST have an explicit prefix (/en, /en/privacy, /es, /es/privacy).
  // - Unprefixed public requests (e.g. /, /privacy) permanently 308 redirect to /en, /en/privacy.
  if (i18nConfig.localePrefix === "always") {
    if (!hasSupportedLocale) {
      const redirectUrl = new URL(
        `/${i18nConfig.defaultLocale}${pathname === "/" ? "" : pathname}${search}`,
        request.url,
      );
      return NextResponse.redirect(redirectUrl, { status: 308 });
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image|twitter-image|.*\\..*).*)",
  ],
};
