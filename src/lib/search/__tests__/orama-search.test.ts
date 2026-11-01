import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import {
  clientIndexCache,
  loadClientSearchIndex,
  searchClient,
} from "@/lib/search/client/index-loader";
import { OramaEngine } from "@/lib/search/engine/orama-engine";
import {
  normalizeSearchDocument,
  normalizeSearchQuery,
  resolveSearchLocale,
} from "@/lib/search/normalize";
import { ServerSearchManager } from "@/lib/search/server/search-manager";
import type { SearchDocument } from "@/types/search";

describe("Production Orama Search Engine & Architecture", () => {
  beforeEach(() => {
    clientIndexCache.clear();
  });

  afterEach(() => {
    clientIndexCache.clear();
  });

  describe("Shared Search Core & Normalization", () => {
    test("normalizes search query strings cleanly", () => {
      expect(normalizeSearchQuery("  nextjs   starter  ")).toBe("nextjs starter");
      expect(normalizeSearchQuery("")).toBe("");
    });

    test("resolves and falls back search locales correctly", () => {
      expect(resolveSearchLocale("en")).toBe("en");
      expect(resolveSearchLocale("es")).toBe("es");
      expect(resolveSearchLocale("fr")).toBe("en"); // unsupported defaults to en
      expect(resolveSearchLocale(undefined)).toBe("en");
    });

    test("normalizes and sanitizes search documents", () => {
      const normalized = normalizeSearchDocument({
        id: "doc-1",
        locale: "en",
        title: "  Title with spaces  ",
        url: "privacy",
        type: "LEGAL",
        source: "CORE",
        tags: ["GDPR", "gdpr", "Privacy"],
      });

      expect(normalized.title).toBe("Title with spaces");
      expect(normalized.url).toBe("/privacy");
      expect(normalized.type).toBe("legal");
      expect(normalized.source).toBe("core");
      expect(normalized.tags).toEqual(["gdpr", "privacy"]);
      expect(normalized.published).toBe(true);
    });
  });

  describe("Empty Index Safety & Graceful Handling", () => {
    test("creates empty index with zero documents and queries safely", async () => {
      const engine = new OramaEngine();
      await engine.createIndex({ name: "empty-index" });

      expect(await engine.count("empty-index")).toBe(0);

      const result = await engine.search("empty-index", { term: "anything" });
      expect(result.count).toBe(0);
      expect(result.hits).toEqual([]);
      expect(result.elapsedTime).toBeGreaterThanOrEqual(0);
    });

    test("serializes and deserializes empty index without error", async () => {
      const engine = new OramaEngine();
      await engine.createIndex({ name: "empty-export" });

      const exported = await engine.exportIndex("empty-export");
      expect(exported).toBeDefined();

      const restoredEngine = new OramaEngine();
      await restoredEngine.importIndex("empty-import", exported);

      const result = await restoredEngine.search("empty-import", { term: "test" });
      expect(result.count).toBe(0);
      expect(result.hits).toEqual([]);
    });
  });

  describe("Universal Orama Engine (Server & Runtime)", () => {
    test("creates index, inserts genuine documents, and performs full-text search", async () => {
      const engine = new OramaEngine();
      await engine.createIndex({ name: "products" });

      const doc1: SearchDocument = {
        id: "prod-1",
        locale: "en",
        type: "product",
        source: "catalog",
        title: "Wireless Noise-Cancelling Headphones",
        description: "Premium over-ear headphones with superior audio clarity.",
        url: "/products/headphones",
        category: "electronics",
        tags: ["audio", "bluetooth", "wireless"],
        published: true,
      };

      const doc2: SearchDocument = {
        id: "prod-2",
        locale: "en",
        type: "product",
        source: "catalog",
        title: "Mechanical Keyboard",
        description: "RGB mechanical gaming keyboard with tactile switches.",
        url: "/products/keyboard",
        category: "electronics",
        tags: ["gaming", "peripherals"],
        published: true,
      };

      await engine.insert("products", doc1);
      await engine.insert("products", doc2);

      expect(await engine.count("products")).toBe(2);

      const result = await engine.search("products", { term: "headphones" });
      expect(result.count).toBe(1);
      expect(result.hits[0].document.id).toBe("prod-1");
    });

    test("supports serialization and deserialization (export/import)", async () => {
      const engine = new OramaEngine();
      await engine.createIndex({ name: "docs" });

      await engine.insert("docs", {
        id: "doc-1",
        locale: "en",
        type: "article",
        source: "knowledgebase",
        title: "Next.js 16 Caching Architecture",
        description: "Guide to Cache Components and Partial Prerendering",
        url: "/docs/caching",
        published: true,
      });

      const serialized = await engine.exportIndex("docs");
      expect(serialized).toBeDefined();

      const restoredEngine = new OramaEngine();
      await restoredEngine.importIndex("restored-docs", serialized);

      const searchRes = await restoredEngine.search("restored-docs", { term: "caching" });
      expect(searchRes.count).toBe(1);
      expect(searchRes.hits[0].document.id).toBe("doc-1");
    });

    test("supports idempotent upsert operations without duplicate key errors", async () => {
      const engine = new OramaEngine();
      await engine.createIndex({ name: "idempotent-test" });

      const doc: SearchDocument = {
        id: "doc-unique",
        locale: "en",
        type: "page",
        source: "pages",
        title: "Initial Title",
        content: "First pass content",
        url: "/test",
        published: true,
      };

      await engine.upsert("idempotent-test", doc);
      expect(await engine.count("idempotent-test")).toBe(1);

      const updatedDoc: SearchDocument = {
        ...doc,
        title: "Updated Title",
        content: "Second pass content",
      };
      await engine.upsert("idempotent-test", updatedDoc);
      expect(await engine.count("idempotent-test")).toBe(1);

      const fetched = await engine.getById("idempotent-test", "doc-unique");
      expect(fetched?.title).toBe("Updated Title");

      await engine.upsertMultiple("idempotent-test", [
        updatedDoc,
        {
          id: "doc-2",
          locale: "en",
          type: "page",
          source: "pages",
          title: "Second Document",
          url: "/doc-2",
          published: true,
        },
      ]);
      expect(await engine.count("idempotent-test")).toBe(2);
    });

    test("filters out unpublished documents from public search results", async () => {
      const engine = new OramaEngine();
      await engine.createIndex({ name: "published-filter" });

      await engine.upsertMultiple("published-filter", [
        {
          id: "draft-1",
          locale: "en",
          type: "post",
          source: "blog",
          title: "Unpublished Secret Roadmap",
          url: "/secret",
          published: false,
        },
        {
          id: "live-1",
          locale: "en",
          type: "post",
          source: "blog",
          title: "Published Public Roadmap",
          url: "/roadmap",
          published: true,
        },
      ]);

      const res = await engine.search("published-filter", {
        term: "Roadmap",
        where: { published: true },
      });

      expect(res.count).toBe(1);
      expect(res.hits[0].document.id).toBe("live-1");
    });
  });

  describe("Server Search Manager", () => {
    test("indexes and searches documents via ServerSearchManager", async () => {
      const manager = new ServerSearchManager();
      await manager.indexDocuments("en", [
        {
          id: "server-doc-1",
          locale: "en",
          type: "guide",
          source: "server",
          title: "Server Search Guide",
          url: "/guide/server",
          published: true,
        },
      ]);

      const res = await manager.search("en", { term: "Server" });
      expect(res.count).toBe(1);
      expect(res.hits[0].document.id).toBe("server-doc-1");
    });
  });

  describe("Client Index Loading & In-Memory Execution", () => {
    test("loads clean client index without requiring external assets or fake data", async () => {
      const res = await searchClient("en", { term: "anything" });
      expect(res.count).toBe(0);
      expect(res.hits).toEqual([]);
    });

    test("caches initialized client index across multiple calls", async () => {
      const engine1 = await loadClientSearchIndex("en");
      const engine2 = await loadClientSearchIndex("en");
      expect(engine1).toBe(engine2); // Strict instance reference equality from client cache
    });

    test("switches client index when locale changes", async () => {
      const enEngine = await loadClientSearchIndex("en");
      const esEngine = await loadClientSearchIndex("es");
      expect(enEngine).not.toBe(esEngine);
    });
  });
});
