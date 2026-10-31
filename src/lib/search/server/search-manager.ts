import { OramaEngine } from "@/lib/search/engine/orama-engine";
import { getOramaLanguage, resolveSearchLocale } from "@/lib/search/shared/normalize";
import type {
  SearchDocument,
  SearchPersistenceAdapter,
  SearchQueryRequest,
  SearchResponse,
} from "@/lib/search/shared/types";
import { siteConfig } from "@/site.config";

/**
 * Server-side Search Manager for executing searches, indexing external sources,
 * and maintaining isolated indexes in server environments without requiring a database.
 */
export class ServerSearchManager {
  private readonly engine: OramaEngine;
  private readonly persistence?: SearchPersistenceAdapter;

  constructor(engine: OramaEngine = new OramaEngine(), persistence?: SearchPersistenceAdapter) {
    this.engine = engine;
    this.persistence = persistence;
  }

  public getEngine(): OramaEngine {
    return this.engine;
  }

  /**
   * Initializes or ensures an index exists with locale-aware language configuration.
   */
  public async ensureIndex(locale: string): Promise<string> {
    const normalizedLocale = resolveSearchLocale(locale);
    const indexName = `server-${normalizedLocale}`;

    if (!this.engine.hasIndex(indexName)) {
      // Attempt to load from persistence if available
      if (this.persistence) {
        const persisted = await this.persistence.load(indexName);
        if (persisted) {
          await this.engine.importIndex(indexName, persisted);
          return indexName;
        }
      }

      await this.engine.createIndex({
        name: indexName,
        language: getOramaLanguage(normalizedLocale),
      });
    }

    return indexName;
  }

  /**
   * Indexes a collection of documents into the server index.
   */
  public async indexDocuments(
    locale: string,
    documents: readonly SearchDocument[],
  ): Promise<string[]> {
    const indexName = await this.ensureIndex(locale);
    const result = await this.engine.upsertMultiple(indexName, documents);

    if (this.persistence) {
      const serialized = await this.engine.exportIndex(indexName);
      await this.persistence.save(indexName, serialized);
    }

    return result;
  }

  /**
   * Searches the server index for a given locale.
   */
  public async search(
    locale: string,
    query: SearchQueryRequest,
  ): Promise<SearchResponse<SearchDocument>> {
    const indexName = await this.ensureIndex(locale);
    return await this.engine.search(indexName, query);
  }

  /**
   * Serializes a given locale index to a transportable object.
   */
  public async exportLocaleIndex(locale: string): Promise<unknown> {
    const indexName = await this.ensureIndex(locale);
    return await this.engine.exportIndex(indexName);
  }
}

export const serverSearchManager = new ServerSearchManager();
