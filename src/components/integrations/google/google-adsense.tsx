"use client";

import Script from "next/script";
import type { ReactNode } from "react";

import { siteConfig } from "@/site.config";

export function GoogleAdSense(): ReactNode {
  const adsenseConfig = siteConfig.integrations?.googleAdsense;

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
