import { describe, expect, it } from "bun:test";

import {
  ACCEPTED_COOKIE_CATEGORIES,
  DEFAULT_COOKIE_CATEGORIES,
  validateConsentRecord,
} from "@/lib/cookies/consent-storage";
import type { StoredConsentRecord } from "@/types/cookies";

describe("validateConsentRecord", () => {
  const currentVersion = "1.0.0";
  const now = 1700000000000;

  it("should validate and return a valid accepted consent record", () => {
    const validRecord: StoredConsentRecord = {
      decision: "accepted",
      categories: ACCEPTED_COOKIE_CATEGORIES,
      policyVersion: currentVersion,
      decidedAt: now - 1000,
      expiresAt: now + 86400000,
    };

    const result = validateConsentRecord(validRecord, currentVersion, now);
    expect(result).not.toBeNull();
    expect(result?.decision).toBe("accepted");
    expect(result?.categories.necessary).toBe(true);
    expect(result?.categories.analytics).toBe(true);
    expect(result?.categories.advertising).toBe(true);
    expect(result?.categories.preferences).toBe(true);
  });

  it("should validate and return a valid denied consent record", () => {
    const validRecord: StoredConsentRecord = {
      decision: "denied",
      categories: DEFAULT_COOKIE_CATEGORIES,
      policyVersion: currentVersion,
      decidedAt: now - 1000,
      expiresAt: now + 86400000,
    };

    const result = validateConsentRecord(validRecord, currentVersion, now);
    expect(result).not.toBeNull();
    expect(result?.decision).toBe("denied");
    expect(result?.categories.necessary).toBe(true);
    expect(result?.categories.analytics).toBe(false);
    expect(result?.categories.advertising).toBe(false);
    expect(result?.categories.preferences).toBe(false);
  });

  it("should validate a custom consent record with granular categories", () => {
    const customRecord: StoredConsentRecord = {
      decision: "custom",
      categories: {
        necessary: true,
        analytics: true,
        advertising: false,
        preferences: true,
      },
      policyVersion: currentVersion,
      decidedAt: now - 1000,
      expiresAt: now + 86400000,
    };

    const result = validateConsentRecord(customRecord, currentVersion, now);
    expect(result).not.toBeNull();
    expect(result?.decision).toBe("custom");
    expect(result?.categories.necessary).toBe(true);
    expect(result?.categories.analytics).toBe(true);
    expect(result?.categories.advertising).toBe(false);
    expect(result?.categories.preferences).toBe(true);
  });

  it("should fail validation if policy version does not match", () => {
    const mismatchedRecord: StoredConsentRecord = {
      decision: "accepted",
      categories: ACCEPTED_COOKIE_CATEGORIES,
      policyVersion: "0.9.0",
      decidedAt: now - 1000,
      expiresAt: now + 86400000,
    };

    const result = validateConsentRecord(mismatchedRecord, currentVersion, now);
    expect(result).toBeNull();
  });

  it("should fail validation if expired", () => {
    const expiredRecord: StoredConsentRecord = {
      decision: "accepted",
      categories: ACCEPTED_COOKIE_CATEGORIES,
      policyVersion: currentVersion,
      decidedAt: now - 10000,
      expiresAt: now - 100,
    };

    const result = validateConsentRecord(expiredRecord, currentVersion, now);
    expect(result).toBeNull();
  });

  it("should fail validation on invalid decision string", () => {
    const invalidRecord = {
      decision: "invalid-decision",
      categories: DEFAULT_COOKIE_CATEGORIES,
      policyVersion: currentVersion,
      decidedAt: now - 1000,
      expiresAt: now + 86400000,
    };

    const result = validateConsentRecord(invalidRecord, currentVersion, now);
    expect(result).toBeNull();
  });

  it("should fail validation on null or non-object values", () => {
    expect(validateConsentRecord(null, currentVersion, now)).toBeNull();
    expect(validateConsentRecord(undefined, currentVersion, now)).toBeNull();
    expect(validateConsentRecord("invalid", currentVersion, now)).toBeNull();
    expect(validateConsentRecord(123, currentVersion, now)).toBeNull();
  });
});
