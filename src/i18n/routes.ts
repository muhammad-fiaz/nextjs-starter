import { siteConfig } from "@/site.config";

/**
 * Authoritative mapping of supported public routes and their available locale translations.
 * Determines valid hreflang tags, language switcher destination fallbacks, and sitemap entries.
 */
export const localizedRoutes: Record<string, readonly string[]> = {
  "/": siteConfig.i18n.locales,
  "/api": siteConfig.i18n.locales,
  "/search": siteConfig.i18n.locales,
  "/privacy": siteConfig.i18n.locales,
  "/terms": siteConfig.i18n.locales,
  "/cookies": siteConfig.i18n.locales,
} as const;

/**
 * Checks whether a given path is registered as an available translation in a target locale.
 */
export function isRouteAvailable(pathname: string, locale: string): boolean {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const availableLocales = localizedRoutes[normalized];
  if (!availableLocales) {
    return false;
  }
  return availableLocales.includes(locale);
}

/**
 * Returns all available locales for a given route.
 */
export function getAvailableLocalesForRoute(pathname: string): readonly string[] {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return localizedRoutes[normalized] || [];
}
