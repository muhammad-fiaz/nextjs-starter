import { i18nConfig, isSupportedLocale } from "@/i18n/config";
import { isRouteAvailable } from "@/i18n/routes";

/**
 * Checks whether a given path is prefixed with a supported locale.
 */
export function isLocalizedPath(pathname: string): boolean {
  if (!pathname) return false;
  const segments = pathname.split("?")[0]?.split("#")[0]?.split("/").filter(Boolean) || [];
  return segments.length > 0 && isSupportedLocale(segments[0]);
}

/**
 * Extracts the current locale from a pathname, returning defaultLocale if unprefixed.
 */
export function getCurrentLocale(pathname: string): string {
  if (!pathname) return i18nConfig.defaultLocale;
  const segments = pathname.split("?")[0]?.split("#")[0]?.split("/").filter(Boolean) || [];
  if (segments[0] && isSupportedLocale(segments[0])) {
    return segments[0];
  }
  return i18nConfig.defaultLocale;
}

/**
 * Strips any supported locale prefix from a pathname, preserving queries and fragments.
 */
export function removeLocalePrefix(pathname: string): string {
  if (!pathname) return "/";

  // Separate pathname from query and fragment
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

/**
 * Generates the canonical localized path for an internal route and target locale.
 * Respects i18nConfig.enabled and i18nConfig.localePrefix ("as-needed" vs "always").
 */
export function getLocalizedPath(pathname: string, targetLocale?: string): string {
  if (!pathname) return "/";

  // Separate path from query and fragment
  const [baseAndQuery, fragment] = pathname.split("#");
  const [pathOnly, query] = (baseAndQuery || "").split("?");

  // Strip existing locale if present to avoid double-prefixing
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

/**
 * Switches the locale of the current pathname, preserving query params and hash.
 * If the target locale does not have a translation registered for this route,
 * gracefully falls back to the target locale's homepage.
 */
export function switchLocalePath(pathname: string, targetLocale: string): string {
  if (!isSupportedLocale(targetLocale)) {
    return pathname;
  }

  const [baseAndQuery, fragment] = pathname.split("#");
  const [pathOnly, query] = (baseAndQuery || "").split("?");

  // Get raw un-prefixed route
  const rawPath = removeLocalePrefix(pathOnly || "/");

  // Check if route exists in the target locale
  const isAvailable = isRouteAvailable(rawPath, targetLocale);

  if (!isAvailable) {
    // Route translation unavailable: fallback safely to target locale homepage
    return getLocalizedPath("/", targetLocale);
  }

  const targetPath = getLocalizedPath(rawPath, targetLocale);
  const withQuery = query !== undefined ? `${targetPath}?${query}` : targetPath;
  return fragment !== undefined ? `${withQuery}#${fragment}` : withQuery;
}
