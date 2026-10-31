import { describe, expect, it } from "bun:test";

import { constructMetadata } from "@/lib/metadata/construct-metadata";

describe("i18n Metadata and SEO Integration", () => {
  it("generates correct canonical and hreflang alternates under as-needed", () => {
    const meta = constructMetadata({
      path: "/privacy",
      locale: "en",
      title: "Privacy Policy",
    });

    // Canonical for default locale should be clean /privacy
    expect(meta.alternates?.canonical).toBe("http://localhost:3000/privacy");

    // Hreflang alternates
    const languages = meta.alternates?.languages as Record<string, string>;
    expect(languages).toBeDefined();
    expect(languages["en"]).toBe("http://localhost:3000/privacy");
    expect(languages["es"]).toBe("http://localhost:3000/es/privacy");
    expect(languages["x-default"]).toBe("http://localhost:3000/privacy");
  });

  it("generates canonical URL for non-default locale with prefix", () => {
    const meta = constructMetadata({
      path: "/privacy",
      locale: "es",
      title: "Política de Privacidad",
    });

    expect(meta.alternates?.canonical).toBe("http://localhost:3000/es/privacy");
    expect(meta.openGraph?.url).toBe("http://localhost:3000/es/privacy");
  });
});
