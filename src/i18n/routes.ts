import { siteConfig } from "@/site.config";

export function getLocalizedRoutes(): readonly string[] {
  return ["/", "/search", "/privacy", "/terms", "/cookies"];
}

export function isRouteAvailable(pathname: string, locale: string): boolean {
  if (!siteConfig.i18n.locales.includes(locale as any)) {
    return false;
  }
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return getLocalizedRoutes().includes(normalized);
}

export function getAvailableLocalesForRoute(pathname: string): readonly string[] {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (!getLocalizedRoutes().includes(normalized)) {
    return [];
  }
  return siteConfig.i18n.locales;
}
