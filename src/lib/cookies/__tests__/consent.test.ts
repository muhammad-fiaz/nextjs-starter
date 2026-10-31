import { describe, expect, it } from "bun:test";

import { validateConsentRecord } from "@/lib/cookies/consent-storage";
import type { StoredConsentRecord } from "@/types/cookies";

describe("validateConsentRecord", () => {
  const currentVersion = "1.0.0";
  const now = 1700000000000;

  it("should validate and return a valid accepted consent record", () => {
    const validRecord: StoredConsentRecord = {
      decision: "accepted",
      policyVersion: currentVersion,
      decidedAt: now - 1000,
      expiresAt: now + 86400000,
    };

    const result = validateConsentRecord(validRecord, currentVersion, now);
    expect(result).not.toBeNull();
    expect(result?.decision).toBe("accepted");
  });

  it("should validate and return a valid denied consent record", () => {
    const validRecord: StoredConsentRecord = {
      decision: "denied",
      policyVersion: currentVersion,
      decidedAt: now - 1000,
      expiresAt: now + 86400000,
    };

    const result = validateConsentRecord(validRecord, currentVersion, now);
    expect(result).not.toBeNull();
    expect(result?.decision).toBe("denied");
  });

  it("should fail validation if policy version does not match", () => {
    const mismatchedRecord: StoredConsentRecord = {
      decision: "accepted",
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
      policyVersion: currentVersion,
      decidedAt: now - 10000,
      expiresAt: now - 100, // already expired
    };

    const result = validateConsentRecord(expiredRecord, currentVersion, now);
    expect(result).toBeNull();
  });

  it("should fail validation on invalid decision string", () => {
    const invalidRecord = {
      decision: "custom-value",
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
