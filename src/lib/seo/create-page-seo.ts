import type { Metadata } from "next";

import { getLocalizedPath } from "@/i18n/navigation";
import { getAvailableLocalesForRoute } from "@/i18n/routes";
import { constructMetadata } from "@/lib/metadata/construct-metadata";
import { sitemapRegistry } from "@/lib/seo/sitemap-registry";
import { siteConfig } from "@/site.config";
import type { Locale } from "@/types/config";
import type { PageMetadataInput, SitemapEntry } from "@/types/seo";
import { isSupportedLocale } from "@/validation/i18n-config";

export interface CreatePageSeoOptions extends PageMetadataInput {
  readonly sitemap?: boolean | Omit<SitemapEntry, "url">;
}

const STATIC_LAST_MODIFIED = new Date("2026-01-01T00:00:00.000Z");

export function createPageMetadata(options: CreatePageSeoOptions): Metadata {
  const i18nConfig = siteConfig.i18n;
  const metadata = constructMetadata(options);

  if (options.path && options.sitemap !== false && !options.noIndex) {
    const sitemapOpts = typeof options.sitemap === "object" ? options.sitemap : {};
    const normalizedPath = options.path.startsWith("/") ? options.path : `/${options.path}`;

    if (!i18nConfig.enabled) {
      sitemapRegistry.register({
        url: normalizedPath,
        lastModified:
          sitemapOpts.lastModified ||
          (options.modifiedTime ? new Date(options.modifiedTime) : STATIC_LAST_MODIFIED),
        changeFrequency: sitemapOpts.changeFrequency || "monthly",
        priority: sitemapOpts.priority ?? (normalizedPath === "/" ? 1.0 : 0.7),
      });
    } else {
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

export function createDynamicMetadata<TParams extends { lang: string }>(
  resolver: (
    params: TParams & { locale: Locale },
  ) => Promise<CreatePageSeoOptions> | CreatePageSeoOptions,
) {
  return async ({ params }: { params: Promise<TParams> }): Promise<Metadata> => {
    const resolvedParams = await params;
    const locale = isSupportedLocale(resolvedParams.lang)
      ? resolvedParams.lang
      : siteConfig.i18n.defaultLocale;
    const options = await resolver({ ...resolvedParams, locale });
    return createPageMetadata({ ...options, locale });
  };
}
