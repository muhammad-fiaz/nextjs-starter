import type { Metadata } from "next";

import { i18nConfig, isSupportedLocale, type Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/navigation";
import { getAvailableLocalesForRoute } from "@/i18n/routes";
import { constructMetadata } from "@/lib/metadata/construct-metadata";
import { sitemapRegistry } from "@/lib/seo/sitemap-registry";
import type { PageMetadataInput, SitemapEntry } from "@/types/seo";

export interface CreatePageSeoOptions extends PageMetadataInput {
  readonly sitemap?: boolean | Omit<SitemapEntry, "url">;
}

// Build-time static fallback to avoid unstable runtime new Date() during static page prerendering
const STATIC_LAST_MODIFIED = new Date("2026-01-01T00:00:00.000Z");

/**
 * Reusable page metadata generator for static and dynamic localized routes.
 * Automatically registers canonical URLs in the sitemap according to i18nConfig and route availability.
 */
export function createPageMetadata(options: CreatePageSeoOptions): Metadata {
  const metadata = constructMetadata(options);

  if (options.path && options.sitemap !== false && !options.noIndex) {
    const sitemapOpts = typeof options.sitemap === "object" ? options.sitemap : {};
    const normalizedPath = options.path.startsWith("/") ? options.path : `/${options.path}`;

    if (!i18nConfig.enabled) {
      // Single-language mode: register exact path once
      sitemapRegistry.register({
        url: normalizedPath,
        lastModified:
          sitemapOpts.lastModified ||
          (options.modifiedTime ? new Date(options.modifiedTime) : STATIC_LAST_MODIFIED),
        changeFrequency: sitemapOpts.changeFrequency || "monthly",
        priority: sitemapOpts.priority ?? (normalizedPath === "/" ? 1.0 : 0.7),
      });
    } else {
      // Localized mode: only register published translations
      const availableLocales = getAvailableLocalesForRoute(normalizedPath);
      const localesToRegister =
        availableLocales.length > 0 ? availableLocales : [i18nConfig.defaultLocale];

      for (const loc of localesToRegister) {
        const canonicalLocPath = getLocalizedPath(normalizedPath, loc);
        sitemapRegistry.register({
          url: canonicalLocPath,
          lastModified:
            sitemapOpts.lastModified ||
            (options.modifiedTime ? new Date(options.modifiedTime) : STATIC_LAST_MODIFIED),
          changeFrequency: sitemapOpts.changeFrequency || "monthly",
          priority: sitemapOpts.priority ?? (normalizedPath === "/" ? 1.0 : 0.7),
        });
      }
    }
  }

  return metadata;
}

/**
 * Creates dynamic metadata for route segments with promise params.
 */
export function createDynamicMetadata<TParams extends { lang: string }>(
  resolver: (
    params: TParams & { locale: Locale },
  ) => Promise<CreatePageSeoOptions> | CreatePageSeoOptions,
) {
  return async ({ params }: { params: Promise<TParams> }): Promise<Metadata> => {
    const resolvedParams = await params;
    const locale = isSupportedLocale(resolvedParams.lang)
      ? resolvedParams.lang
      : i18nConfig.defaultLocale;
    const options = await resolver({ ...resolvedParams, locale });
    return createPageMetadata({ ...options, locale });
  };
}
