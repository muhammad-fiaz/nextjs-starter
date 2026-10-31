import { OramaEngine } from "@/lib/search/engine/orama-engine";
import { getOramaLanguage, resolveSearchLocale } from "@/lib/search/shared/normalize";
import type { SearchDocument, SearchQueryRequest, SearchResponse } from "@/lib/search/shared/types";

/**
 * In-memory client cache for deserialized Orama instances.
 */
class ClientIndexCache {
  private readonly instances = new Map<string, OramaEngine>();
  private readonly inflight = new Map<string, Promise<OramaEngine>>();

  public get(locale: string): OramaEngine | undefined {
    return this.instances.get(locale);
  }

  public set(locale: string, engine: OramaEngine): void {
    this.instances.set(locale, engine);
  }

  public getInflight(locale: string): Promise<OramaEngine> | undefined {
    return this.inflight.get(locale);
  }

  public setInflight(locale: string, promise: Promise<OramaEngine>): void {
    this.inflight.set(locale, promise);
  }

  public removeInflight(locale: string): void {
    this.inflight.delete(locale);
  }

  public clear(): void {
    this.instances.clear();
    this.inflight.clear();
  }
}

export const clientIndexCache = new ClientIndexCache();

/**
 * Loads and initializes the search index for the specified locale.
 * Fetches from `/search/[locale]/index.json` if available.
 * If not present or empty, initializes a clean, valid in-memory index for the locale.
 * Does not fabricate artificial documents.
 */
export async function loadClientSearchIndex(locale: string): Promise<OramaEngine> {
  const normalizedLocale = resolveSearchLocale(locale);

  // Return cached engine if already initialized
  const cached = clientIndexCache.get(normalizedLocale);
  if (cached) {
    return cached;
  }

  // Deduplicate inflight requests
  const inflight = clientIndexCache.getInflight(normalizedLocale);
  if (inflight) {
    return await inflight;
  }

  const loadPromise = (async () => {
    const engine = new OramaEngine();
    const indexName = `client-${normalizedLocale}`;

    try {
      // Attempt to fetch static index from public assets if one exists
      const response = await fetch(`/search/${normalizedLocale}/index.json`, {
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const serialized = await response.json();
        if (serialized) {
          await engine.importIndex(indexName, serialized);
          clientIndexCache.set(normalizedLocale, engine);
          return engine;
        }
      }
    } catch {
      // Network or parsing failure: proceed to clean empty index creation
    }

    // Initialize clean, valid Orama index with no artificial/fabricated documents
    await engine.createIndex({
      name: indexName,
      language: getOramaLanguage(normalizedLocale),
    });

    clientIndexCache.set(normalizedLocale, engine);
    return engine;
  })();

  clientIndexCache.setInflight(normalizedLocale, loadPromise);

  try {
    return await loadPromise;
  } finally {
    clientIndexCache.removeInflight(normalizedLocale);
  }
}

/**
 * Executes a client-side search against the locally loaded Orama index.
 */
export async function searchClient(
  locale: string,
  request: SearchQueryRequest,
): Promise<SearchResponse<SearchDocument>> {
  const normalizedLocale = resolveSearchLocale(locale);
  const engine = await loadClientSearchIndex(normalizedLocale);
  const indexName = `client-${normalizedLocale}`;

  return await engine.search(indexName, {
    ...request,
    where: {
      published: true,
      ...request.where,
    },
  });
}
