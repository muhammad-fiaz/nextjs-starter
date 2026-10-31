import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { dictionarySchema } from "@/i18n/types";

describe("JSON-Driven Localization Architecture", () => {
  const localesDir = join(process.cwd(), "src", "i18n", "locales");
  const files = readdirSync(localesDir).filter((f) => f.endsWith(".json"));

  test("all locale files conform to strict dictionary schema", () => {
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const fullPath = join(localesDir, file);
      const raw = JSON.parse(readFileSync(fullPath, "utf-8"));
      const parsed = dictionarySchema.safeParse(raw);

      if (!parsed.success) {
        console.error(`Validation error in ${file}:`, parsed.error.format());
      }
      expect(parsed.success).toBe(true);
      expect(raw.metadata.locale).toBe(file.replace(".json", ""));
    }
  });

  test("all locales share exact same logical content keys for legal and api pages", () => {
    const enContent = JSON.parse(readFileSync(join(localesDir, "en.json"), "utf-8"));
    const esContent = JSON.parse(readFileSync(join(localesDir, "es.json"), "utf-8"));

    // Compare legal pages sections
    const enPrivacySectionIds = enContent.pages.legal.privacy.sections.map((s: any) => s.id);
    const esPrivacySectionIds = esContent.pages.legal.privacy.sections.map((s: any) => s.id);
    expect(esPrivacySectionIds).toEqual(enPrivacySectionIds);

    const enTermsSectionIds = enContent.pages.legal.terms.sections.map((s: any) => s.id);
    const esTermsSectionIds = esContent.pages.legal.terms.sections.map((s: any) => s.id);
    expect(esTermsSectionIds).toEqual(enTermsSectionIds);

    const enCookiesSectionIds = enContent.pages.legal.cookies.sections.map((s: any) => s.id);
    const esCookiesSectionIds = esContent.pages.legal.cookies.sections.map((s: any) => s.id);
    expect(esCookiesSectionIds).toEqual(enCookiesSectionIds);

    // Compare api endpoints
    const enApiPaths = enContent.pages.api.endpoints.map((e: any) => e.path);
    const esApiPaths = esContent.pages.api.endpoints.map((e: any) => e.path);
    expect(esApiPaths).toEqual(enApiPaths);
  });
});
