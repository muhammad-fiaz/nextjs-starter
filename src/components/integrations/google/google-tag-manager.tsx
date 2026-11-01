"use client";

import Script from "next/script";
import type { ReactNode } from "react";

import { useConsent } from "@/components/cookies/cookie-consent-provider";
import { siteConfig } from "@/site.config";

export function GoogleTagManager(): ReactNode {
  const { decision } = useConsent();
  const gtmConfig = siteConfig.integrations?.googleTagManager;

  if (decision !== "accepted") return null;
  if (!gtmConfig?.enabled || !gtmConfig.containerId) return null;

  const containerId = gtmConfig.containerId;

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'dataLayer','dataLayer','${containerId}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
