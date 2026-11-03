"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { env } from "@/env";
import { siteConfig } from "@/site.config";
import { useConsentStore } from "@/stores/consent-store";

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

const DynamicVercelAnalytics = dynamic(
  () =>
    import("@/components/integrations/vercel/vercel-analytics").then((mod) => mod.VercelAnalytics),
  { ssr: false },
);

const DynamicVercelSpeedInsights = dynamic(
  () =>
    import("@/components/integrations/vercel/vercel-speed-insights").then(
      (mod) => mod.VercelSpeedInsights,
    ),
  { ssr: false },
);

/**
 * Central integration policy.
 *
 * Integrations are only mounted when both:
 * - they are enabled in `site.config.ts`, and
 * - the matching consent category is granted (or cookie consent is disabled).
 *
 * Vercel Analytics and Speed Insights only load in production builds.
 */
export function IntegrationManager(): ReactNode {
  const isLoaded = useConsentStore((state) => state.isLoaded);
  const isAnalyticsAllowed = useConsentStore(
    (state) => state.record?.categories.analytics ?? false,
  );
  const isAdvertisingAllowed = useConsentStore(
    (state) => state.record?.categories.advertising ?? false,
  );

  const isConsentDisabled = !siteConfig.cookies?.enabled;

  if (!isLoaded && !isConsentDisabled) {
    return null;
  }

  const allowAnalytics = isConsentDisabled || isAnalyticsAllowed;
  const allowAdvertising = isConsentDisabled || isAdvertisingAllowed;
  const isProduction = env.NEXT_PUBLIC_NODE_ENV === "production";

  const integrations = siteConfig.integrations;

  const gtm = integrations?.googleTagManager;
  const ga = integrations?.googleAnalytics;
  const adsense = integrations?.googleAdsense;
  const clarity = integrations?.clarity;
  const vercel = integrations?.vercel;

  const gtmContainerId = gtm?.containerId;
  const gaMeasurementId = ga?.measurementId;
  const adsensePublisherId = adsense?.publisherId;
  const clarityProjectId = clarity?.projectId;

  const isGtmActive = Boolean(gtm?.enabled && gtmContainerId);
  const isGtmActingAsAnalytics =
    isGtmActive && gtm?.analyticsStrategy === "gtm" && ga?.analyticsStrategy !== "standalone";

  const showGtm = allowAnalytics && Boolean(gtm?.enabled && gtmContainerId);
  const showGa =
    allowAnalytics && !isGtmActingAsAnalytics && Boolean(ga?.enabled && gaMeasurementId);
  const showAdSense = allowAdvertising && Boolean(adsense?.enabled && adsensePublisherId);
  const showClarity = allowAnalytics && Boolean(clarity?.enabled && clarityProjectId);

  const showVercelAnalytics = isProduction && allowAnalytics && vercel?.analytics !== false;
  const showVercelSpeedInsights = isProduction && allowAnalytics && vercel?.speedInsights !== false;

  return (
    <>
      {showGtm && gtmContainerId ? <DynamicGoogleTagManager containerId={gtmContainerId} /> : null}
      {showGa && gaMeasurementId ? (
        <DynamicGoogleAnalytics measurementId={gaMeasurementId} />
      ) : null}
      {showAdSense && adsensePublisherId ? (
        <DynamicGoogleAdSense publisherId={adsensePublisherId} />
      ) : null}
      {showClarity && clarityProjectId ? (
        <DynamicMicrosoftClarity projectId={clarityProjectId} />
      ) : null}
      {showVercelAnalytics ? <DynamicVercelAnalytics /> : null}
      {showVercelSpeedInsights ? <DynamicVercelSpeedInsights /> : null}
    </>
  );
}
