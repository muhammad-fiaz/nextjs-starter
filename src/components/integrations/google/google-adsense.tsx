"use client";

import Script from "next/script";
import type { ReactNode } from "react";

import { useConsent } from "@/components/cookies/cookie-consent-provider";
import { siteConfig } from "@/site.config";

export function GoogleAdSense(): ReactNode {
  const { decision } = useConsent();
  const adsenseConfig = siteConfig.integrations?.googleAdsense;

  if (decision !== "accepted") return null;
  if (!adsenseConfig?.enabled || !adsenseConfig.publisherId) return null;

  return (
    <Script
      id="google-adsense"
      strategy="lazyOnload"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseConfig.publisherId}`}
    />
  );
}
