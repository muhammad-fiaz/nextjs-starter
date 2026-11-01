"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const DynamicGoogleTagManager = dynamic(
  () =>
    import("@/components/integrations/google/google-tag-manager").then(
      (mod) => mod.GoogleTagManager,
    ),
  { ssr: false },
);

const DynamicGoogleAnalytics = dynamic(
  () =>
    import("@/components/integrations/google/google-analytics").then((mod) => mod.GoogleAnalytics),
  { ssr: false },
);

const DynamicGoogleAdSense = dynamic(
  () => import("@/components/integrations/google/google-adsense").then((mod) => mod.GoogleAdSense),
  { ssr: false },
);

const DynamicMicrosoftClarity = dynamic(
  () =>
    import("@/components/integrations/clarity/microsoft-clarity").then(
      (mod) => mod.MicrosoftClarity,
    ),
  { ssr: false },
);

export function IntegrationManager(): ReactNode {
  return (
    <>
      <DynamicGoogleTagManager />
      <DynamicGoogleAnalytics />
      <DynamicGoogleAdSense />
      <DynamicMicrosoftClarity />
    </>
  );
}
