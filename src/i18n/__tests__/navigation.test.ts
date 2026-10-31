import { describe, expect, it } from "bun:test";

import { i18nConfig } from "@/i18n/config";
import {
  getCurrentLocale,
  getLocalizedPath,
  isLocalizedPath,
  removeLocalePrefix,
  switchLocalePath,
} from "@/i18n/navigation";
import { getAvailableLocalesForRoute, isRouteAvailable } from "@/i18n/routes";

describe("i18n Navigation Utility", () => {
  describe("Path Detection & Inspection", () => {
    it("identifies localized paths correctly", () => {
      expect(isLocalizedPath("/es")).toBe(true);
      expect(isLocalizedPath("/es/privacy")).toBe(true);
      expect(isLocalizedPath("/en")).toBe(true);
      expect(isLocalizedPath("/en/terms")).toBe(true);
      expect(isLocalizedPath("/")).toBe(false);
      expect(isLocalizedPath("/privacy")).toBe(false);
      expect(isLocalizedPath("/esomething")).toBe(false);
    });

    it("extracts current locale from path accurately", () => {
      expect(getCurrentLocale("/es")).toBe("es");
      expect(getCurrentLocale("/es/privacy")).toBe("es");
      expect(getCurrentLocale("/en/privacy")).toBe("en");
      expect(getCurrentLocale("/privacy")).toBe("en");
      expect(getCurrentLocale("/")).toBe("en");
    });

    it("removes locale prefix cleanly while preserving query and fragment", () => {
      expect(removeLocalePrefix("/es/privacy")).toBe("/privacy");
      expect(removeLocalePrefix("/en/privacy?tab=settings#section")).toBe(
        "/privacy?tab=settings#section",
      );
      expect(removeLocalePrefix("/privacy")).toBe("/privacy");
      expect(removeLocalePrefix("/es")).toBe("/");
      expect(removeLocalePrefix("/")).toBe("/");
    });
  });

  describe("getLocalizedPath under 'as-needed' strategy", () => {
    it("omits defaultLocale prefix and includes non-default prefix", () => {
      // Default locale: "en" -> clean URLs
      expect(getLocalizedPath("/", "en")).toBe("/");
      expect(getLocalizedPath("/privacy", "en")).toBe("/privacy");
      expect(getLocalizedPath("/dashboard", "en")).toBe("/dashboard");

      // Non-default locale: "es" -> prefixed URLs
      expect(getLocalizedPath("/", "es")).toBe("/es");
      expect(getLocalizedPath("/privacy", "es")).toBe("/es/privacy");
      expect(getLocalizedPath("/dashboard", "es")).toBe("/es/dashboard");
    });

    it("prevents double-prefixing when input is already prefixed", () => {
      expect(getLocalizedPath("/es/privacy", "es")).toBe("/es/privacy");
      expect(getLocalizedPath("/es/privacy", "en")).toBe("/privacy");
      expect(getLocalizedPath("/en/privacy", "es")).toBe("/es/privacy");
    });

    it("preserves query parameters and URL fragments", () => {
      expect(getLocalizedPath("/privacy?source=footer&test=1#policy", "en")).toBe(
        "/privacy?source=footer&test=1#policy",
      );
      expect(getLocalizedPath("/privacy?source=footer#policy", "es")).toBe(
        "/es/privacy?source=footer#policy",
      );
    });
  });

  describe("switchLocalePath and Route Availability", () => {
    it("switches locale preserving route, query, and fragment", () => {
      expect(switchLocalePath("/privacy?source=footer#sec", "es")).toBe(
        "/es/privacy?source=footer#sec",
      );
      expect(switchLocalePath("/es/privacy?source=footer", "en")).toBe("/privacy?source=footer");
    });

    it("falls back to target locale homepage if route is not translated", () => {
      // Non-existent route
      expect(isRouteAvailable("/untranslated-custom-page", "es")).toBe(false);
      expect(switchLocalePath("/untranslated-custom-page", "es")).toBe("/es");
    });

    it("provides available locales for registered routes", () => {
      expect(getAvailableLocalesForRoute("/")).toEqual(["en", "es"]);
      expect(getAvailableLocalesForRoute("/privacy")).toEqual(["en", "es"]);
      expect(getAvailableLocalesForRoute("/non-existent")).toEqual([]);
    });
  });
});
