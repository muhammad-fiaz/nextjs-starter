import { siteConfig } from "@/site.config";
import type { SearchDocument, SearchDocumentInput } from "@/types/search";

export function isSupportedLocale(locale: string): boolean {
  return siteConfig.i18n.locales.includes(locale as any);
}

export function resolveSearchLocale(locale?: string): string {
  if (locale && isSupportedLocale(locale)) {
    return locale;
  }
  return siteConfig.i18n.defaultLocale;
}

export function getOramaLanguage(locale: string): string {
  const languageMap = siteConfig.i18n.localeToLanguage || {
    en: "english",
    es: "spanish",
  };
  return languageMap[locale] || "english";
}

export function normalizeSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ");
}

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
