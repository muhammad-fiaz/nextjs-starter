import { i18nConfig } from "@/i18n/config";

/**
 * Native Intl formatting helpers respecting active locale.
 */
export function formatDate(
  date: Date | string | number,
  locale: string = i18nConfig.defaultLocale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options ?? { dateStyle: "medium" }).format(d);
}

export function formatNumber(
  value: number,
  locale: string = i18nConfig.defaultLocale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = i18nConfig.defaultLocale,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: string = i18nConfig.defaultLocale,
): string {
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(value, unit);
}
