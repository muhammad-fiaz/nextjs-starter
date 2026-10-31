"use client";

import Script from "next/script";
import type { ReactNode } from "react";

import { useConsent } from "@/components/cookies/cookie-consent-provider";
import { siteConfig } from "@/site.config";

export function MicrosoftClarity(): ReactNode {
  const { decision } = useConsent();
  const clarityConfig = siteConfig.integrations?.clarity;

  // Strict consent check: only load if user accepted optional tracking and project ID configured
  if (decision !== "accepted") return null;
  if (!clarityConfig?.enabled || !clarityConfig.projectId) return null;

  const projectId = clarityConfig.projectId;

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
      }}
    />
  );
}
