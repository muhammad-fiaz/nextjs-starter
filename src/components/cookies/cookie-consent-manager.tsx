"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect } from "react";

import { siteConfig } from "@/site.config";
import { useConsentStore } from "@/stores/consent-store";

const DynamicBanner = dynamic(
  () => import("@/components/cookies/cookie-consent-banner").then((mod) => mod.CookieConsentBanner),
  { ssr: false },
);

export function CookieConsentManager(): ReactNode {
  const initialize = useConsentStore((state) => state.initialize);
  const isLoaded = useConsentStore((state) => state.isLoaded);
  const record = useConsentStore((state) => state.record);
  const accept = useConsentStore((state) => state.accept);
  const deny = useConsentStore((state) => state.deny);
  const setCategoryConsent = useConsentStore((state) => state.setCategoryConsent);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const isEnabled = Boolean(siteConfig.cookies?.enabled && siteConfig.cookies?.banner?.enabled);
  const shouldShowBanner = isLoaded && isEnabled && record === null;

  if (!shouldShowBanner) return null;

  return (
    <DynamicBanner
      onAccept={accept}
      onDeny={deny}
      onSavePreferences={setCategoryConsent}
      cookiePolicyUrl={siteConfig.cookies?.banner?.cookiePolicyUrl ?? "/cookies"}
    />
  );
}
