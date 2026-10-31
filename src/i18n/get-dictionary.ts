import { notFound } from "next/navigation";

import { i18nConfig, isSupportedLocale, type Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import type { Dictionary } from "@/i18n/types";

/**
 * Loads and validates the translation dictionary for a given locale.
 * Rejects unsupported locales with notFound() - no silent fallback.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const loader = dictionaries[locale];
  if (!loader) {
    notFound();
  }

  return await loader();
}
