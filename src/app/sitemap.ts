import type { MetadataRoute } from "next";

import { i18nConfig } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/navigation";
import { localizedRoutes } from "@/i18n/routes";
import { sitemapRegistry } from "@/lib/seo/sitemap-registry";
import { siteConfig } from "@/site.config";

// Static fallback date to keep prerender deterministic
const DEFAULT_SITEMAP_DATE = new Date("2026-01-01T00:00:00.000Z");

/**
 * Dynamic sitemap generator supporting localized routes and canonical paths.
 * Respects i18nConfig.enabled, i18nConfig.localePrefix, and published translations.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const registered = sitemapRegistry.getEntries();
  const siteUrl = siteConfig.url?.replace(/\/$/, "") || "http://localhost:3000";

  const defaultEntries: MetadataRoute.Sitemap = [];

  if (!i18nConfig.enabled) {
    // Single language mode: only unprefixed public routes
    for (const route of Object.keys(localizedRoutes)) {
      defaultEntries.push({
        url: `${siteUrl}${route === "/" ? "" : route}`,
        lastModified: DEFAULT_SITEMAP_DATE,
        changeFrequency: route === "/" ? "weekly" : "monthly",
        priority: route === "/" ? 1.0 : 0.7,
      });
    }
  } else {
    // Localized mode: for each published route and its available locales
    for (const [route, availableLocales] of Object.entries(localizedRoutes)) {
      for (const loc of availableLocales) {
        const canonicalPath = getLocalizedPath(route, loc);
        defaultEntries.push({
          url: `${siteUrl}${canonicalPath === "/" ? "" : canonicalPath}`,
          lastModified: DEFAULT_SITEMAP_DATE,
          changeFrequency: route === "/" ? "weekly" : "monthly",
          priority: route === "/" ? 1.0 : 0.7,
        });
      }
    }
  }

  // Combine default entries with dynamically registered entries, deduping by URL
  const seenUrls = new Set<string>();
  const combined: MetadataRoute.Sitemap = [];

  for (const entry of [
    ...defaultEntries,
    ...registered.map((r) => ({
      url: r.url.startsWith("http") ? r.url : `${siteUrl}${r.url === "/" ? "" : r.url}`,
      lastModified: r.lastModified || DEFAULT_SITEMAP_DATE,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
  ]) {
    if (!seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      combined.push(entry);
    }
  }

  return combined;
}
