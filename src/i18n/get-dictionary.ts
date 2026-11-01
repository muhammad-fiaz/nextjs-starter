import { notFound } from "next/navigation";

import { siteConfig } from "@/site.config";
import type { Locale } from "@/types/config";
import type { Dictionary } from "@/validation/i18n";
import { dictionarySchema } from "@/validation/i18n";
import { isSupportedLocale } from "@/validation/i18n-config";

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  try {
    const raw = await import(`../../locales/${locale}.json`);
    return dictionarySchema.parse(raw.default);
  } catch {
    if (locale !== siteConfig.i18n.defaultLocale) {
      try {
        const fallback = await import(`../../locales/${siteConfig.i18n.defaultLocale}.json`);
        return dictionarySchema.parse(fallback.default);
      } catch {
        notFound();
      }
    }
    notFound();
  }
}
