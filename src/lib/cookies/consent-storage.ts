import { siteConfig } from "@/site.config";
import type {
  ConsentDecision,
  CookieAttributes,
  CookieCategoriesConsent,
  StoredConsentRecord,
} from "@/types/cookies";

export const COOKIE_CONSENT_KEY = "app-cookie-consent";
export const COOKIE_CONSENT_VERSION = siteConfig.cookies?.consent?.policyVersion ?? "1.0.0";

export const DEFAULT_COOKIE_CATEGORIES: CookieCategoriesConsent = {
  necessary: true,
  analytics: false,
  advertising: false,
  preferences: false,
};

export const ACCEPTED_COOKIE_CATEGORIES: CookieCategoriesConsent = {
  necessary: true,
  analytics: true,
  advertising: true,
  preferences: true,
};

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

export function setCookie(name: string, value: string, attributes: CookieAttributes = {}): void {
  if (typeof document === "undefined") return;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (attributes.maxAge !== undefined) {
    cookieString += `; max-age=${attributes.maxAge}`;
  } else if (attributes.expires) {
    cookieString += `; expires=${attributes.expires.toUTCString()}`;
  }

  cookieString += `; path=${attributes.path || "/"}`;

  if (attributes.domain) {
    cookieString += `; domain=${attributes.domain}`;
  }

  if (
    attributes.secure ??
    (typeof window !== "undefined" && window.location.protocol === "https:")
  ) {
    cookieString += "; secure";
  }

  cookieString += `; samesite=${attributes.sameSite || "lax"}`;

  document.cookie = cookieString;
}

export function deleteCookie(name: string, path: string = "/", domain?: string): void {
  if (typeof document === "undefined") return;
  let cookieString = `${encodeURIComponent(name)}=; max-age=0; path=${path}`;
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  document.cookie = cookieString;
}

export function validateConsentRecord(
  rawRecord: unknown,
  expectedVersion: string,
  now: number = Date.now(),
): StoredConsentRecord | null {
  if (!rawRecord || typeof rawRecord !== "object") return null;

  const record = rawRecord as Partial<StoredConsentRecord>;
  if (
    record.decision !== "accepted" &&
    record.decision !== "denied" &&
    record.decision !== "custom"
  ) {
    return null;
  }
  if (typeof record.policyVersion !== "string" || record.policyVersion !== expectedVersion) {
    return null;
  }
  if (typeof record.decidedAt !== "number" || typeof record.expiresAt !== "number") {
    return null;
  }
  if (now > record.expiresAt) return null;

  const rawCats = (record.categories || {}) as Partial<CookieCategoriesConsent>;
  const categories: CookieCategoriesConsent = {
    necessary: true,
    analytics: Boolean(rawCats.analytics ?? record.decision === "accepted"),
    advertising: Boolean(rawCats.advertising ?? record.decision === "accepted"),
    preferences: Boolean(rawCats.preferences ?? record.decision === "accepted"),
  };

  return {
    decision: record.decision,
    categories,
    policyVersion: record.policyVersion,
    decidedAt: record.decidedAt,
    expiresAt: record.expiresAt,
  };
}

export function getStoredConsent(): StoredConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY) || getCookie(COOKIE_CONSENT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const expectedVersion = COOKIE_CONSENT_VERSION;
    return validateConsentRecord(parsed, expectedVersion);
  } catch {
    return null;
  }
}

export function setStoredConsent(
  decision: ConsentDecision,
  customCategories?: Partial<CookieCategoriesConsent>,
): StoredConsentRecord {
  const policyVersion = COOKIE_CONSENT_VERSION;
  const durationDays = siteConfig.cookies?.consent?.defaultDurationDays ?? 180;
  const now = Date.now();
  const maxAgeSeconds = durationDays * 24 * 60 * 60;
  const expiresAt = now + maxAgeSeconds * 1000;

  let categories: CookieCategoriesConsent;
  if (decision === "accepted") {
    categories = ACCEPTED_COOKIE_CATEGORIES;
  } else if (decision === "denied") {
    categories = DEFAULT_COOKIE_CATEGORIES;
  } else {
    categories = {
      necessary: true,
      analytics: Boolean(customCategories?.analytics),
      advertising: Boolean(customCategories?.advertising),
      preferences: Boolean(customCategories?.preferences),
    };
  }

  const record: StoredConsentRecord = {
    decision,
    categories,
    policyVersion,
    decidedAt: now,
    expiresAt,
  };

  if (typeof window !== "undefined") {
    try {
      const serialized = JSON.stringify(record);
      window.localStorage.setItem(COOKIE_CONSENT_KEY, serialized);
      setCookie(COOKIE_CONSENT_KEY, serialized, {
        maxAge: maxAgeSeconds,
        sameSite: "lax",
      });
      window.dispatchEvent(new CustomEvent("consentDecisionChanged", { detail: record }));
    } catch {}
  }

  return record;
}

export function clearStoredConsent(): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(COOKIE_CONSENT_KEY);
      deleteCookie(COOKIE_CONSENT_KEY);
      window.dispatchEvent(new CustomEvent("consentDecisionChanged", { detail: null }));
    } catch {}
  }
}
