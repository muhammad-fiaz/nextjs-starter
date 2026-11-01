import { siteConfig } from "@/site.config";
import type { ConsentDecision, StoredConsentRecord } from "@/types/cookies";

export const COOKIE_CONSENT_KEY = "app-cookie-consent";
export const COOKIE_CONSENT_VERSION = siteConfig.cookies?.consent?.policyVersion ?? "1.0.0";

export function validateConsentRecord(
  rawRecord: unknown,
  expectedVersion: string,
  now: number = Date.now(),
): StoredConsentRecord | null {
  if (!rawRecord || typeof rawRecord !== "object") return null;

  const record = rawRecord as Partial<StoredConsentRecord>;
  if (record.decision !== "accepted" && record.decision !== "denied") return null;
  if (typeof record.policyVersion !== "string" || record.policyVersion !== expectedVersion)
    return null;
  if (typeof record.decidedAt !== "number" || typeof record.expiresAt !== "number") return null;
  if (now > record.expiresAt) return null;

  return {
    decision: record.decision,
    policyVersion: record.policyVersion,
    decidedAt: record.decidedAt,
    expiresAt: record.expiresAt,
  };
}

export function getStoredConsent(): StoredConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const expectedVersion = COOKIE_CONSENT_VERSION;
    return validateConsentRecord(parsed, expectedVersion);
  } catch {
    return null;
  }
}

export function setStoredConsent(decision: ConsentDecision): StoredConsentRecord {
  const policyVersion = COOKIE_CONSENT_VERSION;
  const durationDays = siteConfig.cookies?.consent.defaultDurationDays ?? 180;
  const now = Date.now();
  const expiresAt = now + durationDays * 24 * 60 * 60 * 1000;

  const record: StoredConsentRecord = {
    decision,
    policyVersion,
    decidedAt: now,
    expiresAt,
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
      window.dispatchEvent(new CustomEvent("consentDecisionChanged", { detail: record }));
    } catch {}
  }

  return record;
}

export function clearStoredConsent(): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(COOKIE_CONSENT_KEY);
      window.dispatchEvent(new CustomEvent("consentDecisionChanged", { detail: null }));
    } catch {}
  }
}
