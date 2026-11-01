import { siteConfig } from "@/site.config";

export function formatDate(
  date: Date | string | number,
  locale: string = siteConfig.i18n.defaultLocale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options ?? { dateStyle: "medium" }).format(d);
}

export function formatNumber(
  value: number,
  locale: string = siteConfig.i18n.defaultLocale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = siteConfig.i18n.defaultLocale,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: string = siteConfig.i18n.defaultLocale,
): string {
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(value, unit);
}
