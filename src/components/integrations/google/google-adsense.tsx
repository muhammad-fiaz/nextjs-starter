"use client";

import Script from "next/script";
import type { ReactNode } from "react";

import type { GoogleAdSenseProps } from "@/types/integrations";

export function GoogleAdSense({ publisherId }: GoogleAdSenseProps): ReactNode {
  return (
    <Script
      id="google-adsense"
      strategy="lazyOnload"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
    />
  );
}
