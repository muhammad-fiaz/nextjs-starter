import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { siteConfig } from "@/site.config";
import { dictionarySchema } from "@/validation/i18n";

describe("JSON-Driven Localization Architecture", () => {
  const localesDir = join(process.cwd(), "locales");
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

  test("site config locales stay in sync with the locale files", () => {
    const fileLocales = files.map((file) => file.replace(/\.json$/, "")).sort();

    expect([...siteConfig.i18n.locales].sort()).toEqual(fileLocales);
    expect(fileLocales).toContain(siteConfig.i18n.defaultLocale);

    const rtlLocales = files
      .map((file) => ({
        locale: file.replace(/\.json$/, ""),
        metadata: JSON.parse(readFileSync(join(localesDir, file), "utf-8")).metadata,
      }))
      .filter(({ metadata }) => metadata.direction === "rtl")
      .map(({ locale }) => locale)
      .sort();

    expect([...(siteConfig.i18n.rtlLocales ?? [])].sort()).toEqual(rtlLocales);

    for (const locale of fileLocales) {
      expect(siteConfig.i18n.localeLabels[locale]).toBeTruthy();
    }
  });

  test("all locales have identical key structure without any missing keys", () => {
    function getDeepKeys(obj: Record<string, any>, prefix = ""): string[] {
      return Object.keys(obj).reduce((res: string[], el: string) => {
        const key = prefix ? `${prefix}.${el}` : el;
        if (typeof obj[el] === "object" && obj[el] !== null && !Array.isArray(obj[el])) {
          res.push(...getDeepKeys(obj[el], key));
        } else {
          res.push(key);
        }
        return res;
      }, []);
    }

    const enContent = JSON.parse(readFileSync(join(localesDir, "en.json"), "utf-8"));
    const enKeys = getDeepKeys(enContent).sort();

    for (const file of files) {
      if (file === "en.json") continue;
      const fileContent = JSON.parse(readFileSync(join(localesDir, file), "utf-8"));
      const fileKeys = getDeepKeys(fileContent).sort();
      expect(fileKeys).toEqual(enKeys);
    }
  });

  test("all locales share exact same logical content keys for legal pages", () => {
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
  });
});
