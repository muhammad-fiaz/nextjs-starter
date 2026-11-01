import { env } from "@/env";
import type { SiteConfig } from "@/types/config";

export const siteConfig: SiteConfig = {
  name: "Next.js Starter",
  shortName: "NextStarter",
  description:
    "Production-ready, infrastructure-first open source Next.js starter template featuring React 19, TypeScript, Tailwind CSS v4, and modern web foundations.",
  url: env.NEXT_PUBLIC_APP_URL,

  i18n: {
    enabled: true,
    defaultLocale: "en",
    locales: ["en", "es"],
    localePrefix: "as-needed",
    localeLabels: {
      en: "English",
      es: "Español",
    },
    localeToLanguage: {
      en: "english",
      es: "spanish",
    },
    rtlLocales: ["ar", "he", "fa", "ur"],
  },

  creator: "Muhammad Fiaz",
  publisher: "Next.js Starter",
  authors: [
    {
      name: "Muhammad Fiaz",
      url: "https://github.com/muhammad-fiaz",
    },
  ],

  organization: {
    name: "Next.js Starter",
    legalName: "Next.js Starter",
    url: env.NEXT_PUBLIC_APP_URL,
    email: "contact@muhammadfiaz.com",
    telephone: "+1-800-555-0199",
    address: {
      streetAddress: "123 Open Source Blvd",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      postalCode: "94107",
      addressCountry: "US",
    },
  },

  social: {
    github: "https://github.com/muhammad-fiaz/nextjs-starter",
    twitter: "https://x.com/muhammadfiaz_",
  },

  manifest: {
    name: "Next.js Starter",
    shortName: "NextStarter",
    description: "Production-ready open source Next.js starter template",
    display: "standalone",
    startUrl: "/",
  },

  cookies: {
    enabled: true,
    consent: {
      policyVersion: "1.0.0",
      defaultDurationDays: 180,
    },
    banner: {
      enabled: true,
      cookiePolicyUrl: "/cookies",
    },
  },

  integrations: {
    googleTagManager: {
      enabled: false,
      containerId: "",
      analyticsStrategy: "gtm",
    },
    googleAnalytics: {
      enabled: false,
      measurementId: "",
      analyticsStrategy: "standalone",
    },
    googleAdsense: {
      enabled: false,
      publisherId: "",
    },
    clarity: {
      enabled: false,
      projectId: "",
    },
    vercel: {
      analytics: true,
      speedInsights: true,
    },
  },

  pwa: {
    enabled: false,
    swUrl: "/sw.js",
    scope: "/",
    offlineFallbackUrl: "/offline",
  },
};
