import type { CookieConsentConfig, SiteIntegrationsConfig } from "@/types/cookies";
import type { PWAConfig } from "@/types/pwa";

export type Locale = string;
export type LocalePrefix = "always" | "as-needed";

export interface I18nConfig {
  readonly enabled: boolean;
  readonly defaultLocale: string;
  readonly locales: readonly string[];
  readonly localePrefix: LocalePrefix;
  readonly localeLabels: Record<string, string>;
  readonly localeToLanguage?: Record<string, string>;
  readonly rtlLocales?: readonly string[];
}

export interface SiteAuthor {
  readonly name: string;
  readonly url?: string;
}

export interface SiteSocialProfiles {
  readonly twitter?: string;
  readonly github?: string;
  readonly linkedin?: string;
  readonly youtube?: string;
  readonly [key: string]: string | undefined;
}

export interface SiteOrganization {
  readonly name?: string;
  readonly legalName?: string;
  readonly url?: string;
  readonly logo?: string;
  readonly email?: string;
  readonly telephone?: string;
  readonly address?: {
    readonly streetAddress?: string;
    readonly addressLocality?: string;
    readonly addressRegion?: string;
    readonly postalCode?: string;
    readonly addressCountry?: string;
  };
}

export interface SiteManifestConfig {
  readonly name?: string;
  readonly shortName?: string;
  readonly description?: string;
  readonly startUrl?: string;
  readonly display?: "fullscreen" | "standalone" | "minimal-ui" | "browser";
  readonly themeColor?: string;
  readonly backgroundColor?: string;
  readonly orientation?: "any" | "natural" | "landscape" | "portrait";
  readonly icons?: Array<{
    readonly src: string;
    readonly sizes: string;
    readonly type: string;
    readonly purpose?: "any" | "maskable" | "monochrome";
  }>;
}

export interface SiteConfig {
  readonly name?: string;
  readonly shortName?: string;
  readonly description?: string;
  readonly url?: string;
  readonly defaultLocale?: string;
  readonly supportedLocales?: readonly string[];
  readonly i18n: I18nConfig;
  readonly authors?: readonly SiteAuthor[];
  readonly creator?: string;
  readonly publisher?: string;
  readonly social?: SiteSocialProfiles;
  readonly organization?: SiteOrganization;
  readonly manifest?: SiteManifestConfig;
  readonly ogImage?: {
    readonly url?: string;
    readonly width?: number;
    readonly height?: number;
    readonly alt?: string;
  };
  readonly cookies?: CookieConsentConfig;
  readonly integrations?: SiteIntegrationsConfig;
  readonly pwa?: PWAConfig;
}
