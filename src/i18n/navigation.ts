import { isRouteAvailable } from "@/i18n/routes";
import { siteConfig } from "@/site.config";
import { isSupportedLocale } from "@/validation/i18n-config";

export function isLocalizedPath(pathname: string): boolean {
  if (!pathname) return false;
  const segments = pathname.split("?")[0]?.split("#")[0]?.split("/").filter(Boolean) || [];
  return segments.length > 0 && isSupportedLocale(segments[0]);
}

export function getCurrentLocale(pathname: string): string {
  const i18nConfig = siteConfig.i18n;
  if (!pathname) return i18nConfig.defaultLocale;
  const segments = pathname.split("?")[0]?.split("#")[0]?.split("/").filter(Boolean) || [];
  if (segments[0] && isSupportedLocale(segments[0])) {
    return segments[0];
  }
  return i18nConfig.defaultLocale;
}

export function removeLocalePrefix(pathname: string): string {
  if (!pathname) return "/";

  const [baseAndQuery, fragment] = pathname.split("#");
  const [pathOnly, query] = (baseAndQuery || "").split("?");

  const segments = (pathOnly || "").split("/").filter(Boolean);
  if (segments[0] && isSupportedLocale(segments[0])) {
    segments.shift();
  }

  const cleanPath = `/${segments.join("/")}`;
  const withQuery = query !== undefined ? `${cleanPath}?${query}` : cleanPath;
  return fragment !== undefined ? `${withQuery}#${fragment}` : withQuery;
}

export function getLocalizedPath(pathname: string, targetLocale?: string): string {
  if (!pathname) return "/";

  const i18nConfig = siteConfig.i18n;
  const [baseAndQuery, fragment] = pathname.split("#");
  const [pathOnly, query] = (baseAndQuery || "").split("?");

  const segments = (pathOnly || "").split("/").filter(Boolean);
  if (segments[0] && isSupportedLocale(segments[0])) {
    segments.shift();
  }

  const cleanSubPath = segments.join("/");

  let basePath = "";
  if (!i18nConfig.enabled) {
    basePath = cleanSubPath ? `/${cleanSubPath}` : "/";
  } else {
    const locale =
      targetLocale && isSupportedLocale(targetLocale) ? targetLocale : i18nConfig.defaultLocale;

    if (i18nConfig.localePrefix === "as-needed" && locale === i18nConfig.defaultLocale) {
      basePath = cleanSubPath ? `/${cleanSubPath}` : "/";
    } else {
      basePath = cleanSubPath ? `/${locale}/${cleanSubPath}` : `/${locale}`;
    }
  }

  const withQuery = query !== undefined ? `${basePath}?${query}` : basePath;
  return fragment !== undefined ? `${withQuery}#${fragment}` : withQuery;
}

export function switchLocalePath(pathname: string, targetLocale: string): string {
  if (!isSupportedLocale(targetLocale)) {
    return pathname;
  }

  const [baseAndQuery, fragment] = pathname.split("#");
  const [pathOnly, query] = (baseAndQuery || "").split("?");

  const rawPath = removeLocalePrefix(pathOnly || "/");

  const isAvailable = isRouteAvailable(rawPath, targetLocale);

  if (!isAvailable) {
    return getLocalizedPath("/", targetLocale);
  }

  const targetPath = getLocalizedPath(rawPath, targetLocale);
  const withQuery = query !== undefined ? `${targetPath}?${query}` : targetPath;
  return fragment !== undefined ? `${withQuery}#${fragment}` : withQuery;
}
