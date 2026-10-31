import { siteConfig } from "@/site.config";
import type { I18nConfig, LocalePrefix } from "@/types/config";

import { isLocale } from "./validation";

/**
 * Global i18n configuration sourced exclusively from site.config.ts as the single source of truth.
 * No secondary editable list of locales is maintained.
 */
export const i18nConfig: I18nConfig = siteConfig.i18n;

export type Locale = string;
export type { LocalePrefix };

export const isSupportedLocale = isLocale;

/**
 * Direction resolution for RTL support (e.g. ar, he, fa, ur)
 */
export const RTL_LOCALES = new Set(["ar", "he", "fa", "ur"]);

export function getLocaleDirection(locale: string): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale.toLowerCase().split("-")[0] || "") ? "rtl" : "ltr";
}
