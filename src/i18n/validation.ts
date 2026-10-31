import { siteConfig } from "@/site.config";
import type { I18nConfig, LocalePrefix } from "@/types/config";

/**
 * Validate configuration contract on initialization:
 * 1. defaultLocale must exist in locales
 * 2. locales must contain unique identifiers
 * 3. localeLabels must provide a label for every configured locale
 */
export function validateI18nConfig(config: I18nConfig): void {
  const { locales, defaultLocale, localeLabels, localePrefix } = config;

  if (!locales || locales.length === 0) {
    throw new Error("[i18n] At least one locale must be configured in site.config.ts.");
  }

  const uniqueLocales = new Set(locales);
  if (uniqueLocales.size !== locales.length) {
    throw new Error("[i18n] Configured locales must be unique in site.config.ts.");
  }

  if (!uniqueLocales.has(defaultLocale)) {
    throw new Error(
      `[i18n] defaultLocale "${defaultLocale}" is not present in configured locales: [${locales.join(", ")}].`,
    );
  }

  if (localePrefix !== "as-needed" && localePrefix !== "always") {
    throw new Error(
      `[i18n] Invalid localePrefix "${localePrefix}". Only "as-needed" and "always" are supported.`,
    );
  }

  for (const locale of locales) {
    if (!localeLabels || !localeLabels[locale]) {
      throw new Error(`[i18n] Missing localeLabel for configured locale "${locale}".`);
    }
    // Basic BCP 47 sanity check (e.g. en, en-US, es, pt-BR)
    if (!/^[a-z]{2,3}(-[A-Za-z0-9]+)?$/.test(locale)) {
      throw new Error(`[i18n] Invalid BCP 47 language identifier: "${locale}".`);
    }
  }
}

// Validate once at module load
validateI18nConfig(siteConfig.i18n);

export function isLocale(value: unknown): value is string {
  return (
    typeof value === "string" && (siteConfig.i18n.locales as readonly string[]).includes(value)
  );
}
