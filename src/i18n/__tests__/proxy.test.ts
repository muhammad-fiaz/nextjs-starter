import { describe, expect, it } from "bun:test";

import { NextRequest } from "next/server";

import { proxy } from "@/proxy";
import { siteConfig } from "@/site.config";

describe("Next.js Proxy i18n Routing", () => {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  const createRequest = (urlPath: string) => {
    return new NextRequest(new URL(`${baseUrl}${urlPath}`));
  };

  describe("Strategy 'as-needed' (default)", () => {
    it("serves '/' without redirect", () => {
      const res = proxy(createRequest("/"));
      // NextResponse.next() continues without redirect headers
      expect(res.headers.get("location")).toBeNull();
    });

    it("serves '/privacy' without redirect", () => {
      const res = proxy(createRequest("/privacy"));
      expect(res.headers.get("location")).toBeNull();
    });

    it("serves '/es' without redirect", () => {
      const res = proxy(createRequest("/es"));
      expect(res.headers.get("location")).toBeNull();
    });

    it("serves '/es/privacy' without redirect", () => {
      const res = proxy(createRequest("/es/privacy"));
      expect(res.headers.get("location")).toBeNull();
    });

    it("permanently redirects '/en' to '/' (308)", () => {
      const res = proxy(createRequest("/en"));
      expect(res.status).toBe(308);
      expect(res.headers.get("location")).toBe(`${baseUrl}/`);
    });

    it("permanently redirects '/en/privacy' to '/privacy' (308)", () => {
      const res = proxy(createRequest("/en/privacy"));
      expect(res.status).toBe(308);
      expect(res.headers.get("location")).toBe(`${baseUrl}/privacy`);
    });

    it("preserves query parameters during normalization redirects", () => {
      const res = proxy(createRequest("/en/privacy?source=footer&campaign=test"));
      expect(res.status).toBe(308);
      expect(res.headers.get("location")).toBe(`${baseUrl}/privacy?source=footer&campaign=test`);
    });

    it("bypasses system assets, API routes, and static files", () => {
      expect(proxy(createRequest("/api/health")).headers.get("location")).toBeNull();
      expect(proxy(createRequest("/sitemap.xml")).headers.get("location")).toBeNull();
      expect(proxy(createRequest("/robots.txt")).headers.get("location")).toBeNull();
      expect(proxy(createRequest("/favicon.ico")).headers.get("location")).toBeNull();
      expect(proxy(createRequest("/opengraph-image")).headers.get("location")).toBeNull();
    });

    it("does not mistake partial segment like '/esomething' for supported locale", () => {
      const res = proxy(createRequest("/esomething"));
      // Under as-needed, unprefixed path is served directly
      expect(res.headers.get("location")).toBeNull();
    });
  });
});
