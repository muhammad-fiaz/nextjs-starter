import { siteConfig } from "@/site.config";

export const localizedRoutes: Record<string, readonly string[]> = {
  "/": siteConfig.i18n.locales,
  "/api": siteConfig.i18n.locales,
  "/search": siteConfig.i18n.locales,
  "/privacy": siteConfig.i18n.locales,
  "/terms": siteConfig.i18n.locales,
  "/cookies": siteConfig.i18n.locales,
} as const;

export function isRouteAvailable(pathname: string, locale: string): boolean {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const availableLocales = localizedRoutes[normalized];
  if (!availableLocales) {
    return false;
  }
  return availableLocales.includes(locale);
}

export function getAvailableLocalesForRoute(pathname: string): readonly string[] {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return localizedRoutes[normalized] || [];
}
