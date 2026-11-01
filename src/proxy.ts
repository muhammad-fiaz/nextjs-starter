import { type NextRequest, NextResponse } from "next/server";

import { siteConfig } from "@/site.config";
import { isSupportedLocale } from "@/validation/i18n-config";

const EXCLUDED_PREFIXES = [
  "/api",
  "/_next",
  "/_vercel",
  "/icons",
  "/images",
  "/sw.js",
  "/robots.txt",
  "/sitemap.xml",
  "/rss.xml",
  "/manifest.webmanifest",
  "/opengraph-image",
  "/twitter-image",
  "/favicon.ico",
  "/icon",
  "/apple-icon",
];

const STATIC_EXTENSIONS_REGEX = /\.(.*)$/;

export function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;

  if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (STATIC_EXTENSIONS_REGEX.test(pathname)) {
    return NextResponse.next();
  }

  const i18nConfig = siteConfig.i18n;

  if (!i18nConfig.enabled) {
    if (pathname.startsWith(`/${i18nConfig.defaultLocale}`)) {
      const clean = pathname.replace(`/${i18nConfig.defaultLocale}`, "") || "/";
      return NextResponse.redirect(new URL(`${clean}${search}`, request.url), { status: 308 });
    }
    const rewriteUrl = new URL(
      `/${i18nConfig.defaultLocale}${pathname === "/" ? "" : pathname}${search}`,
      request.url,
    );
    return NextResponse.rewrite(rewriteUrl);
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  const hasSupportedLocale = Boolean(firstSegment && isSupportedLocale(firstSegment));
  const isDefaultLocaleSegment = firstSegment === i18nConfig.defaultLocale;

  if (i18nConfig.localePrefix === "as-needed") {
    if (isDefaultLocaleSegment) {
      const remainingSegments = segments.slice(1);
      const targetPath = remainingSegments.length > 0 ? `/${remainingSegments.join("/")}` : "/";
      const redirectUrl = new URL(`${targetPath}${search}`, request.url);
      return NextResponse.redirect(redirectUrl, { status: 308 });
    }

    if (hasSupportedLocale) {
      return NextResponse.next();
    }

    const rewriteUrl = new URL(
      `/${i18nConfig.defaultLocale}${pathname === "/" ? "" : pathname}${search}`,
      request.url,
    );
    return NextResponse.rewrite(rewriteUrl);
  }

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
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|icon|apple-icon|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image|twitter-image|.*\\..*).*)",
  ],
};
