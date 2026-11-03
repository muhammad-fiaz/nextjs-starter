import { deleteCookie, getCookie, setCookie } from "@/lib/cookies/client-cookie";
import { siteConfig } from "@/site.config";
import type {
  ConsentDecision,
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

  const candidates: string[] = [];

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) candidates.push(stored);
  } catch {
    // Storage can be unavailable (private mode); fall back to the cookie.
  }

  const cookieValue = getCookie(COOKIE_CONSENT_KEY);
  if (cookieValue) candidates.push(cookieValue);

  for (const raw of candidates) {
    try {
      const record = validateConsentRecord(JSON.parse(raw), COOKIE_CONSENT_VERSION);
      if (record) return record;
    } catch {
      // Ignore malformed records and try the next source.
    }
  }

  return null;
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
    const serialized = JSON.stringify(record);

    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, serialized);
    } catch {
      // The cookie still persists the decision.
    }

    setCookie(COOKIE_CONSENT_KEY, serialized, {
      maxAge: maxAgeSeconds,
      sameSite: "lax",
    });

    window.dispatchEvent(new CustomEvent("consentDecisionChanged", { detail: record }));
  }

  return record;
}

export function clearStoredConsent(): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(COOKIE_CONSENT_KEY);
    } catch {
      // Continue with cookie removal.
    }

    deleteCookie(COOKIE_CONSENT_KEY);
    window.dispatchEvent(new CustomEvent("consentDecisionChanged", { detail: null }));
  }
}
