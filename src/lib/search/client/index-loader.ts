import { OramaEngine } from "@/lib/search/engine/orama-engine";
import { getOramaLanguage, resolveSearchLocale } from "@/lib/search/normalize";
import type { SearchDocument, SearchQueryRequest, SearchResponse } from "@/types/search";

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

export async function loadClientSearchIndex(locale: string): Promise<OramaEngine> {
  const normalizedLocale = resolveSearchLocale(locale);

  const cached = clientIndexCache.get(normalizedLocale);
  if (cached) {
    return cached;
  }

  const inflight = clientIndexCache.getInflight(normalizedLocale);
  if (inflight) {
    return await inflight;
  }

  const loadPromise = (async () => {
    const engine = new OramaEngine();
    const indexName = `client-${normalizedLocale}`;

    try {
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
    } catch {}

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
