import { describe, expect, it } from "bun:test";

import { constructMetadata } from "@/lib/metadata/construct-metadata";
import { siteConfig } from "@/site.config";

describe("i18n Metadata and SEO Integration", () => {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  it("generates correct canonical and hreflang alternates under as-needed", () => {
    const meta = constructMetadata({
      path: "/privacy",
      locale: "en",
      title: "Privacy Policy",
    });

    // Canonical for default locale should be clean /privacy
    expect(meta.alternates?.canonical).toBe(`${baseUrl}/privacy`);

    // Hreflang alternates
    const languages = meta.alternates?.languages as Record<string, string>;
    expect(languages).toBeDefined();
    expect(languages["en"]).toBe(`${baseUrl}/privacy`);
    expect(languages["es"]).toBe(`${baseUrl}/es/privacy`);
    expect(languages["x-default"]).toBe(`${baseUrl}/privacy`);
  });

  it("generates canonical URL for non-default locale with prefix", () => {
    const meta = constructMetadata({
      path: "/privacy",
      locale: "es",
      title: "Política de Privacidad",
    });

    expect(meta.alternates?.canonical).toBe(`${baseUrl}/es/privacy`);
    expect(meta.openGraph?.url).toBe(`${baseUrl}/es/privacy`);
  });
});
