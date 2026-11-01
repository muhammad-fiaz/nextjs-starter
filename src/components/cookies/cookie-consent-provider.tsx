"use client";

import dynamic from "next/dynamic";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

import {
  clearStoredConsent,
  DEFAULT_COOKIE_CATEGORIES,
  deleteCookie,
  getCookie,
  getStoredConsent,
  setCookie,
  setStoredConsent,
} from "@/lib/cookies/consent-storage";
import { siteConfig } from "@/site.config";
import type {
  ConsentDecision,
  CookieAttributes,
  CookieCategoriesConsent,
  StoredConsentRecord,
} from "@/types/cookies";

const DynamicBanner = dynamic(
  () => import("@/components/cookies/cookie-consent-banner").then((mod) => mod.CookieConsentBanner),
  { ssr: false },
);

export interface CookieConsentContextValue {
  readonly record: StoredConsentRecord | null;
  readonly decision: ConsentDecision | null;
  readonly categories: CookieCategoriesConsent;
  readonly isLoaded: boolean;
  readonly isAnalyticsAllowed: boolean;
  readonly isAdvertisingAllowed: boolean;
  readonly isPreferencesAllowed: boolean;
  readonly isCategoryAllowed: (category: keyof CookieCategoriesConsent) => boolean;
  readonly accept: () => void;
  readonly deny: () => void;
  readonly setCategoryConsent: (categories: Partial<CookieCategoriesConsent>) => void;
  readonly resetConsent: () => void;
  readonly getCookie: (name: string) => string | null;
  readonly setCookie: (name: string, value: string, attributes?: CookieAttributes) => void;
  readonly deleteCookie: (name: string, path?: string, domain?: string) => void;
}

const ConsentContext = createContext<CookieConsentContextValue>({
  record: null,
  decision: null,
  categories: DEFAULT_COOKIE_CATEGORIES,
  isLoaded: false,
  isAnalyticsAllowed: false,
  isAdvertisingAllowed: false,
  isPreferencesAllowed: false,
  isCategoryAllowed: () => false,
  accept: () => {},
  deny: () => {},
  setCategoryConsent: () => {},
  resetConsent: () => {},
  getCookie: () => null,
  setCookie: () => {},
  deleteCookie: () => {},
});

export function useConsent(): CookieConsentContextValue {
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

  const setCategoryConsent = (customCategories: Partial<CookieCategoriesConsent>) => {
    const newRecord = setStoredConsent("custom", customCategories);
    setRecord(newRecord);
  };

  const resetConsent = () => {
    clearStoredConsent();
    setRecord(null);
  };

  const categories = record?.categories ?? DEFAULT_COOKIE_CATEGORIES;

  const contextValue = useMemo<CookieConsentContextValue>(
    () => ({
      record,
      decision: record?.decision ?? null,
      categories,
      isLoaded,
      isAnalyticsAllowed: categories.analytics,
      isAdvertisingAllowed: categories.advertising,
      isPreferencesAllowed: categories.preferences,
      isCategoryAllowed: (category: keyof CookieCategoriesConsent) => categories[category] ?? false,
      accept,
      deny,
      setCategoryConsent,
      resetConsent,
      getCookie,
      setCookie,
      deleteCookie,
    }),
    [record, categories, isLoaded],
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
