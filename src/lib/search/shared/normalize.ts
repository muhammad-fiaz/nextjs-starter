import { siteConfig } from "@/site.config";

import type { SearchDocument, SearchDocumentInput } from "./types";

/**
 * Validates whether a locale is supported by site configuration.
 */
export function isSupportedLocale(locale: string): boolean {
  return siteConfig.i18n.locales.includes(locale as any);
}

/**
 * Resolves a normalized, supported locale string or defaults to system default.
 */
export function resolveSearchLocale(locale?: string): string {
  if (locale && isSupportedLocale(locale)) {
    return locale;
  }
  return siteConfig.i18n.defaultLocale;
}

/**
 * Resolves the appropriate Orama language analyzer name from a locale code.
 */
export function getOramaLanguage(locale: string): string {
  switch (locale) {
    case "es":
      return "spanish";
    case "fr":
      return "french";
    case "de":
      return "german";
    case "it":
      return "italian";
    case "pt":
      return "portuguese";
    case "nl":
      return "dutch";
    default:
      return "english";
  }
}

/**
 * Normalizes user search input: removes excessive whitespace and sanitizes query.
 */
export function normalizeSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ");
}

/**
 * Normalizes a raw input search document into a sanitized, validated SearchDocument.
 */
export function normalizeSearchDocument(input: SearchDocumentInput): SearchDocument {
  const locale = resolveSearchLocale(input.locale);
  const normalizedTitle = input.title.trim();
  const normalizedUrl = input.url.startsWith("/") ? input.url : `/${input.url}`;

  return {
    id: input.id.trim(),
    locale,
    title: normalizedTitle,
    description: input.description?.trim() || undefined,
    content: input.content?.trim() || undefined,
    url: normalizedUrl,
    canonicalUrl: input.canonicalUrl?.trim() || undefined,
    type: input.type.trim().toLowerCase(),
    category: input.category?.trim() || undefined,
    tags: input.tags ? Array.from(new Set(input.tags.map((t) => t.trim().toLowerCase()))) : [],
    keywords: input.keywords
      ? Array.from(new Set(input.keywords.map((k) => k.trim().toLowerCase())))
      : [],
    source: input.source.trim().toLowerCase(),
    published: input.published ?? true,
    updatedAt: input.updatedAt ?? Date.now(),
    author: input.author?.trim() || undefined,
    imageUrl: input.imageUrl?.trim() || undefined,
    metadata: input.metadata,
  };
}
