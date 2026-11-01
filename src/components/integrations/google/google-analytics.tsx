"use client";

import Script from "next/script";
import type { ReactNode } from "react";

import { siteConfig } from "@/site.config";

export function GoogleAnalytics(): ReactNode {
  const gaConfig = siteConfig.integrations?.googleAnalytics;
  const gtmConfig = siteConfig.integrations?.googleTagManager;

  if (!gaConfig?.enabled || !gaConfig.measurementId) return null;

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
