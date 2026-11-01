import { describe, expect, it } from "bun:test";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { constructMetadata, resolveOrigin } from "@/lib/metadata/construct-metadata";
import {
  createDynamicOgImage,
  defaultOgContentType,
  defaultOgDimensions,
} from "@/lib/og/generate-og";
import { siteConfig } from "@/site.config";

describe("Production-Readiness SSR & Open Graph Verification", () => {
  describe("Request-Aware Origin Resolution & Fallbacks", () => {
    it("respects custom origin when passed explicitly (e.g. from SSR headers)", () => {
      const meta = constructMetadata(
        {
          title: "Custom Port Page",
          path: "/privacy",
        },
        "http://localhost:4000",
      );

      expect(meta.metadataBase?.toString()).toBe("http://localhost:4000/");
      expect(meta.alternates?.canonical).toBe("http://localhost:4000/privacy");

      const ogImages = meta.openGraph?.images as Array<{ url: string }>;
      expect(ogImages[0].url).toContain("http://localhost:4000/opengraph-image");

      const twitterImages = meta.twitter?.images as string[];
      expect(twitterImages[0]).toContain("http://localhost:4000/opengraph-image");
    });

    it("handles preview deployment URLs accurately", () => {
      const previewOrigin = "https://preview-branch-xyz.vercel.app";
      const meta = constructMetadata(
        {
          title: "Preview Test",
          path: "/cookies",
        },
        previewOrigin,
      );

      expect(meta.metadataBase?.toString()).toBe("https://preview-branch-xyz.vercel.app/");
      expect(meta.alternates?.canonical).toBe("https://preview-branch-xyz.vercel.app/cookies");
    });

    it("normalizes trailing slashes consistently", () => {
      const originWithSlash = resolveOrigin("https://example.com///");
      expect(originWithSlash).toBe("https://example.com");
    });
  });

  describe("Route-by-Route Metadata Verification", () => {
    const publicRoutes = [
      {
        path: "/",
        expectedTitle: `Next.js Starter | ${siteConfig.name}`,
        noIndex: false,
      },
      {
        path: "/cookies",
        expectedTitle: `Cookie Policy | ${siteConfig.name}`,
        noIndex: false,
      },
      {
        path: "/privacy",
        expectedTitle: `Privacy Policy | ${siteConfig.name}`,
        noIndex: false,
      },
      {
        path: "/terms",
        expectedTitle: `Terms of Service | ${siteConfig.name}`,
        noIndex: false,
      },
      {
        path: "/search",
        expectedTitle: `Search | ${siteConfig.name}`,
        noIndex: false,
      },
      {
        path: "/offline",
        expectedTitle: `Offline | ${siteConfig.name}`,
        noIndex: true,
      },
    ];

    for (const route of publicRoutes) {
      it(`verifies complete metadata for route: ${route.path}`, () => {
        const meta = constructMetadata({
          title: route.expectedTitle.split(" | ")[0],
          path: route.path,
          noIndex: route.noIndex,
        });

        // Canonical URL
        if (route.noIndex) {
          expect(meta.robots).toEqual({ index: false, follow: false });
        } else {
          expect(meta.alternates?.canonical).toBeDefined();
          expect(meta.alternates?.canonical?.toString()).toContain(
            route.path === "/" ? "" : route.path,
          );
        }

        // OpenGraph
        expect(meta.openGraph).toBeDefined();
        expect(meta.openGraph?.title).toBe(route.expectedTitle);
        expect(meta.openGraph?.siteName).toBe(siteConfig.name);
        expect((meta.openGraph as Record<string, unknown>)?.type).toBe("website");

        const ogImages = meta.openGraph?.images as Array<{
          url: string;
          width: number;
          height: number;
        }>;
        expect(ogImages).toBeDefined();
        expect(ogImages.length).toBeGreaterThan(0);
        expect(ogImages[0].width).toBe(1200);
        expect(ogImages[0].height).toBe(630);
        expect(ogImages[0].url).toContain("/opengraph-image");

        // Twitter Card
        expect(meta.twitter).toBeDefined();
        expect((meta.twitter as Record<string, unknown>)?.card).toBe("summary_large_image");
        expect(meta.twitter?.title).toBe(route.expectedTitle);
        const twitterImages = meta.twitter?.images as string[];
        expect(twitterImages).toBeDefined();
        expect(twitterImages.length).toBeGreaterThan(0);
      });
    }
  });

  describe("Dynamic Social Card Security, Unicode, and Dimensions", () => {
    it("renders valid ImageResponse with 1200x630 dimensions and image/png Content-Type", async () => {
      const response = createDynamicOgImage({
        title: "Security & Verification",
        description: "Checking PNG generation and buffer validity",
      });

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("image/png");
      expect(defaultOgDimensions.width).toBe(1200);
      expect(defaultOgDimensions.height).toBe(630);
      expect(defaultOgContentType).toBe("image/png");

      const arrayBuffer = await response.arrayBuffer();
      expect(arrayBuffer.byteLength).toBeGreaterThan(0);

      // Verify PNG magic signature: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
      const uint8 = new Uint8Array(arrayBuffer);
      expect(uint8[0]).toBe(0x89);
      expect(uint8[1]).toBe(0x50); // P
      expect(uint8[2]).toBe(0x4e); // N
      expect(uint8[3]).toBe(0x47); // G
      expect(uint8[4]).toBe(0x0d);
      expect(uint8[5]).toBe(0x0a);
      expect(uint8[6]).toBe(0x1a);
      expect(uint8[7]).toBe(0x0a);
    });

    it("sanitizes extremely long strings and malicious control characters cleanly", async () => {
      const longTitle = "A".repeat(500) + "\x00\x08malicious";
      const longDesc = "B".repeat(1000) + "\x1B[31mcolor\x1B[0m";

      const response = createDynamicOgImage({
        title: longTitle,
        description: longDesc,
      });

      expect(response.status).toBe(200);
      const arrayBuffer = await response.arrayBuffer();
      expect(arrayBuffer.byteLength).toBeGreaterThan(0);
    });

    it("handles international Unicode characters and emojis safely", async () => {
      const unicodeTitle = "Next.js 🚀 Starter — 한국어 / Español / 日本語";
      const response = createDynamicOgImage({
        title: unicodeTitle,
        description: "Unicode test across multiple alphabets & glyphs",
      });

      expect(response.status).toBe(200);
      const arrayBuffer = await response.arrayBuffer();
      expect(arrayBuffer.byteLength).toBeGreaterThan(0);
    });
  });

  describe("Robots and Crawler Access Policies", () => {
    it("ensures social crawlers (Twitterbot, facebookexternalhit, LinkedInBot) have explicit access", () => {
      const config = robots();
      const rules = Array.isArray(config.rules) ? config.rules : [config.rules];

      const twitterRule = rules.find((r) => r.userAgent === "Twitterbot");
      expect(twitterRule).toBeDefined();
      expect(twitterRule?.allow).toBe("/");

      const fbRule = rules.find((r) => r.userAgent === "facebookexternalhit");
      expect(fbRule).toBeDefined();
      expect(fbRule?.allow).toBe("/");

      const linkedInRule = rules.find((r) => r.userAgent === "LinkedInBot");
      expect(linkedInRule).toBeDefined();
      expect(linkedInRule?.allow).toBe("/");

      // Private routes disallowed from generic crawling
      const wildcard = rules.find((r) => r.userAgent === "*");
      expect(wildcard).toBeDefined();
      const disallowed = Array.isArray(wildcard?.disallow)
        ? wildcard.disallow
        : [wildcard?.disallow];
      expect(disallowed).toContain("/offline");
      expect(disallowed).toContain("/admin/");
      expect(disallowed).toContain("/api/");

      // Sitemap referenced
      expect(config.sitemap).toBeDefined();
      expect(config.sitemap?.toString()).toContain("/sitemap.xml");
    });
  });

  describe("Sitemap Coverage and Registration", () => {
    it("includes all canonical routes and localized variants in sitemap", () => {
      const entries = sitemap();
      expect(entries.length).toBeGreaterThan(0);

      const urls = entries.map((e) => e.url);
      const siteUrl = resolveOrigin();

      expect(urls).toContain(`${siteUrl}`);
      expect(urls).toContain(`${siteUrl}/privacy`);
      expect(urls).toContain(`${siteUrl}/terms`);
      expect(urls).toContain(`${siteUrl}/cookies`);
      expect(urls).toContain(`${siteUrl}/search`);
      // Localized es variants
      expect(urls).toContain(`${siteUrl}/es`);
      expect(urls).toContain(`${siteUrl}/es/privacy`);
    });
  });
});
