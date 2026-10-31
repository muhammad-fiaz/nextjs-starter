"use client";

import dynamic from "next/dynamic";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { getStoredConsent, setStoredConsent } from "@/lib/cookies/consent-storage";
import { siteConfig } from "@/site.config";
import type { ConsentDecision, StoredConsentRecord } from "@/types/cookies";

// Dynamically load the banner UI client-side only when needed
const DynamicBanner = dynamic(
  () => import("@/components/cookies/cookie-consent-banner").then((mod) => mod.CookieConsentBanner),
  { ssr: false },
);

interface ConsentContextValue {
  readonly record: StoredConsentRecord | null;
  readonly decision: ConsentDecision | null;
  readonly isLoaded: boolean;
  readonly accept: () => void;
  readonly deny: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  record: null,
  decision: null,
  isLoaded: false,
  accept: () => {},
  deny: () => {},
});

export function useConsent(): ConsentContextValue {
  return useContext(ConsentContext);
}

export function CookieConsentProvider({ children }: { readonly children: ReactNode }): ReactNode {
  const [record, setRecord] = useState<StoredConsentRecord | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const existing = getStoredConsent();
    setRecord(existing);
    setIsLoaded(true);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "app-cookie-consent") {
        setRecord(getStoredConsent());
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<StoredConsentRecord | null>;
      setRecord(customEvent.detail ?? null);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("consentDecisionChanged", handleCustomChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("consentDecisionChanged", handleCustomChange);
    };
  }, []);

  const accept = () => {
    const newRecord = setStoredConsent("accepted");
    setRecord(newRecord);
  };

  const deny = () => {
    const newRecord = setStoredConsent("denied");
    setRecord(newRecord);
  };

  const contextValue = useMemo<ConsentContextValue>(
    () => ({
      record,
      decision: record?.decision ?? null,
      isLoaded,
      accept,
      deny,
    }),
    [record, isLoaded],
  );

  const isEnabled = siteConfig.cookies?.enabled && siteConfig.cookies?.banner?.enabled;
  const shouldShowBanner = isLoaded && isEnabled && record === null;

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
      {shouldShowBanner ? (
        <DynamicBanner
          onAccept={accept}
          onDeny={deny}
          cookiePolicyUrl={siteConfig.cookies?.banner?.cookiePolicyUrl ?? "/cookies"}
        />
      ) : null}
    </ConsentContext.Provider>
  );
}
