import { OramaEngine } from "@/lib/search/orama-engine";
import type { SearchDocument, SearchQueryRequest, SearchResponse } from "@/types/search";

const CLIENT_INDEX_NAME = "client";

class ClientIndexCache {
  private instance?: OramaEngine;
  private inflight?: Promise<OramaEngine>;

  public get(): OramaEngine | undefined {
    return this.instance;
  }

  public set(engine: OramaEngine): void {
    this.instance = engine;
  }

  public getInflight(): Promise<OramaEngine> | undefined {
    return this.inflight;
  }

  public setInflight(promise: Promise<OramaEngine>): void {
    this.inflight = promise;
  }

  public removeInflight(): void {
    this.inflight = undefined;
  }

  public clear(): void {
    this.instance = undefined;
    this.inflight = undefined;
  }
}

export const clientIndexCache = new ClientIndexCache();

async function createClientEngine(): Promise<OramaEngine> {
  const engine = new OramaEngine();
  await engine.createIndex({ name: CLIENT_INDEX_NAME });
  clientIndexCache.set(engine);
  return engine;
}

/**
 * Builds the local Orama index once per session.
 *
 * Search documents are supplied by the future backend (REST API, database,
 * Shopify, etc). Until a data source is connected, the index stays empty and
 * queries return no results. Locale JSON files are only used for UI copy.
 */
export async function loadClientSearchIndex(): Promise<OramaEngine> {
  const cached = clientIndexCache.get();
  if (cached) {
    return cached;
  }

  const inflight = clientIndexCache.getInflight();
  if (inflight) {
    return await inflight;
  }

  const loadPromise = createClientEngine();
  clientIndexCache.setInflight(loadPromise);

  try {
    return await loadPromise;
  } finally {
    clientIndexCache.removeInflight();
  }
}

export async function searchClient(
  request: SearchQueryRequest,
): Promise<SearchResponse<SearchDocument>> {
  const engine = await loadClientSearchIndex();

  return await engine.search(CLIENT_INDEX_NAME, {
    ...request,
    where: {
      published: true,
      ...request.where,
    },
  });
}
