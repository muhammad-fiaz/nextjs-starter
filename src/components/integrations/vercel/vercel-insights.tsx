import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";

import { env } from "@/env";
import { siteConfig } from "@/site.config";

export function VercelInsights(): ReactNode {
  if (env.NODE_ENV !== "production" || !env.VERCEL) {
    return null;
  }

  const vercelConfig = siteConfig.integrations?.vercel;
  const enableAnalytics = vercelConfig?.analytics !== false;
  const enableSpeedInsights = vercelConfig?.speedInsights !== false;

  return (
    <>
      {enableAnalytics ? <Analytics /> : null}
      {enableSpeedInsights ? <SpeedInsights /> : null}
    </>
  );
}
