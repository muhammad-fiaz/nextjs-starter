import type { MetadataRoute } from "next";

import { env } from "@/env";
import { getLocalizedPath } from "@/i18n/navigation";
import { getAvailableLocalesForRoute, getLocalizedRoutes } from "@/i18n/routes";
import { sitemapRegistry } from "@/lib/seo/sitemap-registry";
import { siteConfig } from "@/site.config";

const DEFAULT_SITEMAP_DATE = new Date("2026-01-01T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const i18nConfig = siteConfig.i18n;
  const registered = sitemapRegistry.getEntries();
  const rawUrl = env.NEXT_PUBLIC_APP_URL || siteConfig.url || "http://localhost:3000";
  const siteUrl = rawUrl.replace(/\/$/, "");

  const defaultEntries: MetadataRoute.Sitemap = [];
  const routes = getLocalizedRoutes();

  if (!i18nConfig.enabled) {
    for (const route of routes) {
      defaultEntries.push({
        url: `${siteUrl}${route === "/" ? "" : route}`,
        lastModified: DEFAULT_SITEMAP_DATE,
        changeFrequency: route === "/" ? "weekly" : "monthly",
        priority: route === "/" ? 1.0 : 0.7,
      });
    }
  } else {
    for (const route of routes) {
      const availableLocales = getAvailableLocalesForRoute(route);
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
