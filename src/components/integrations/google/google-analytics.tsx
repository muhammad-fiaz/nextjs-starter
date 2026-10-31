"use client";

import Script from "next/script";
import type { ReactNode } from "react";

import { useConsent } from "@/components/cookies/cookie-consent-provider";
import { siteConfig } from "@/site.config";

export function GoogleAnalytics(): ReactNode {
  const { decision } = useConsent();
  const gaConfig = siteConfig.integrations?.googleAnalytics;
  const gtmConfig = siteConfig.integrations?.googleTagManager;

  // Strict check: only run if accepted, enabled, and has valid ID
  if (decision !== "accepted") return null;
  if (!gaConfig?.enabled || !gaConfig.measurementId) return null;

  // Prevent double tracking if GTM is handling analytics
  if (
    gtmConfig?.enabled &&
    gtmConfig.analyticsStrategy === "gtm" &&
    gaConfig.analyticsStrategy !== "standalone"
  ) {
    return null;
  }

  const measurementId = gaConfig.measurementId;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
