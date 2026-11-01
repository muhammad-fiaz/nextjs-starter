import type { Metadata } from "next";

import { getLocalizedPath } from "@/i18n/navigation";
import { getAvailableLocalesForRoute, isRouteAvailable } from "@/i18n/routes";
import { siteConfig } from "@/site.config";
import type { Locale } from "@/types/config";
import type { PageMetadataInput } from "@/types/seo";

export function constructMetadata(input: PageMetadataInput = {}): Metadata {
  const i18nConfig = siteConfig.i18n;
  const {
    locale = i18nConfig.defaultLocale,
    title,
    description = siteConfig.description,
    path = "",
    noIndex = false,
    keywords,
    ogType = "website",
    ogImage,
    openGraph: customOg,
    twitter: customTwitter,
    robots: customRobots,
    publishedTime,
    modifiedTime,
    authors,
  } = input;

  const siteUrl = siteConfig.url?.replace(/\/$/, "") || "http://localhost:3000";

  const canonicalPath = getLocalizedPath(path, locale);
  const canonicalUrl = `${siteUrl}${canonicalPath === "/" ? "" : canonicalPath}`;

  const languageAlternates: Record<string, string> = {};
  if (i18nConfig.enabled) {
    const rawPath = path.startsWith("/") ? path : `/${path}`;
    const availableLocales = getAvailableLocalesForRoute(rawPath);

    for (const loc of availableLocales) {
      const locPath = getLocalizedPath(rawPath, loc);
      languageAlternates[loc] = `${siteUrl}${locPath === "/" ? "" : locPath}`;
    }

    if (isRouteAvailable(rawPath, i18nConfig.defaultLocale)) {
      const defaultPath = getLocalizedPath(rawPath, i18nConfig.defaultLocale);
      languageAlternates["x-default"] = `${siteUrl}${defaultPath === "/" ? "" : defaultPath}`;
    }
  }

  const ogTitleParam = encodeURIComponent(title || siteConfig.name || "Next.js Starter");
  const ogDescParam = encodeURIComponent(description || "");
  const defaultImage = {
    url: `${siteUrl}/opengraph-image?title=${ogTitleParam}&description=${ogDescParam}`,
    width: 1200,
    height: 630,
    alt: siteConfig.name || "Open Graph Image",
  };

  const socialImage = ogImage
    ? {
        url: ogImage.url.startsWith("http") ? ogImage.url : `${siteUrl}${ogImage.url}`,
        width: ogImage.width || 1200,
        height: ogImage.height || 630,
        alt: ogImage.alt || title || siteConfig.name,
      }
    : defaultImage;

  const resolvedTitle = title
    ? siteConfig.name
      ? `${title} | ${siteConfig.name}`
      : title
    : siteConfig.name;

  return {
    metadataBase: new URL(siteUrl),
    title: resolvedTitle,
    description,
    applicationName: siteConfig.name,
    authors: authors
      ? authors.map((name) => ({ name }))
      : siteConfig.authors
        ? siteConfig.authors.map((a) => ({ name: a.name, url: a.url }))
        : undefined,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    keywords: keywords
      ? [...keywords]
      : ["Next.js", "Starter", "React 19", "TypeScript", "Tailwind CSS"],
    robots:
      customRobots ||
      (noIndex
        ? { index: false, follow: false }
        : {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              "max-video-preview": -1,
              "max-image-preview": "large",
              "max-snippet": -1,
            },
          }),
    alternates: {
      canonical: canonicalUrl,
      ...(i18nConfig.enabled && Object.keys(languageAlternates).length > 0
        ? { languages: languageAlternates }
        : {}),
    },
    openGraph: {
      title: customOg?.title || resolvedTitle,
      description: customOg?.description || description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale,
      type: ogType,
      images: customOg?.images || [socialImage],
      ...customOg,
    },
    twitter: {
      card: "summary_large_image",
      title: customTwitter?.title || resolvedTitle,
      description: customTwitter?.description || description,
      images: customTwitter?.images || [socialImage.url],
      creator: siteConfig.social?.twitter
        ? `@${siteConfig.social.twitter.replace(/^https?:\/\/(x|twitter)\.com\//, "")}`
        : undefined,
      ...customTwitter,
    },
  };
}
