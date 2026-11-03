import {
  type AnyOrama,
  type AnySchema,
  count as oramaCount,
  create,
  getByID,
  insert,
  insertMultiple,
  load as oramaLoad,
  remove,
  removeMultiple,
  save as oramaSave,
  search as oramaSearch,
  update,
  upsert,
  upsertMultiple,
} from "@orama/orama";

import { DocumentValidationError, IndexNotFoundError } from "@/lib/search/errors";
import { normalizeSearchDocument } from "@/lib/search/normalize";
import { defaultSearchSchema } from "@/lib/search/schema";
import { siteConfig } from "@/site.config";
import type {
  CreateIndexOptions,
  SearchDocument,
  SearchHit,
  SearchQueryRequest,
  SearchResponse,
} from "@/types/search";
import { searchDocumentSchema } from "@/validation/search";

export class OramaEngine {
  private readonly indexes: Map<string, AnyOrama> = new Map();

  public async createIndex(options: CreateIndexOptions): Promise<AnyOrama> {
    const {
      name,
      schema = defaultSearchSchema as unknown as AnySchema,
      language = siteConfig.i18n.localeToLanguage?.[siteConfig.i18n.defaultLocale] ??
        siteConfig.i18n.defaultLocale,
    } = options;

    const db = await create({
      schema,
      language,
    });

    this.indexes.set(name, db);
    return db;
  }

  public getIndex(name: string): AnyOrama {
    const db = this.indexes.get(name);
    if (!db) {
      throw new IndexNotFoundError(name);
    }
    return db;
  }

  public hasIndex(name: string): boolean {
    return this.indexes.has(name);
  }

  public deleteIndex(name: string): boolean {
    return this.indexes.delete(name);
  }

  public clear(): void {
    this.indexes.clear();
  }

  public async insert(indexName: string, document: SearchDocument): Promise<string> {
    const parsed = searchDocumentSchema.safeParse(document);
    if (!parsed.success) {
      throw new DocumentValidationError(
        "Failed to validate search document",
        parsed.error.format(),
      );
    }

    const normalized = normalizeSearchDocument(parsed.data);
    const db = this.getIndex(indexName);
    return await insert(db, normalized as any);
  }

  public async insertMultiple(
    indexName: string,
    documents: readonly SearchDocument[],
  ): Promise<string[]> {
    const validated: SearchDocument[] = [];
    for (const doc of documents) {
      const parsed = searchDocumentSchema.safeParse(doc);
      if (!parsed.success) {
        throw new DocumentValidationError(
          `Validation failed for document ${doc.id}`,
          parsed.error.format(),
        );
      }
      validated.push(normalizeSearchDocument(parsed.data));
    }

    const db = this.getIndex(indexName);
    return await insertMultiple(db, validated as any);
  }

  public async upsert(indexName: string, document: SearchDocument): Promise<string> {
    const parsed = searchDocumentSchema.safeParse(document);
    if (!parsed.success) {
      throw new DocumentValidationError(
        "Failed to validate search document",
        parsed.error.format(),
      );
    }

    const normalized = normalizeSearchDocument(parsed.data);
    const db = this.getIndex(indexName);
    return await upsert(db, normalized as any);
  }

  public async upsertMultiple(
    indexName: string,
    documents: readonly SearchDocument[],
  ): Promise<string[]> {
    const validated: SearchDocument[] = [];
    for (const doc of documents) {
      const parsed = searchDocumentSchema.safeParse(doc);
      if (!parsed.success) {
        throw new DocumentValidationError(
          `Validation failed for document ${doc.id}`,
          parsed.error.format(),
        );
      }
      validated.push(normalizeSearchDocument(parsed.data));
    }

    const db = this.getIndex(indexName);
    return await upsertMultiple(db, validated as any);
  }

  public async getById(indexName: string, id: string): Promise<SearchDocument | null> {
    const db = this.getIndex(indexName);
    const doc = await getByID(db, id);
    return (doc as SearchDocument) ?? null;
  }

  public async remove(indexName: string, id: string): Promise<boolean> {
    const db = this.getIndex(indexName);
    return await remove(db, id);
  }

  public async removeMultiple(indexName: string, ids: readonly string[]): Promise<number> {
    const db = this.getIndex(indexName);
    return await removeMultiple(db, ids as string[]);
  }

  public async update(indexName: string, id: string, document: SearchDocument): Promise<string> {
    const parsed = searchDocumentSchema.safeParse(document);
    if (!parsed.success) {
      throw new DocumentValidationError("Validation failed for document", parsed.error.format());
    }

    const normalized = normalizeSearchDocument(parsed.data);
    const db = this.getIndex(indexName);
    return await update(db, id, normalized as any);
  }

  public async count(indexName: string): Promise<number> {
    const db = this.getIndex(indexName);
    return await oramaCount(db);
  }

  public async search(
    indexName: string,
    params: SearchQueryRequest,
  ): Promise<SearchResponse<SearchDocument>> {
    const db = this.getIndex(indexName);

    const searchParams: Record<string, unknown> = {
      term: params.term,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
      exact: params.exact,
      tolerance: params.tolerance,
    };

    if (params.properties && params.properties.length > 0) {
      searchParams.properties = params.properties;
    }

    if (params.boost) {
      searchParams.boost = params.boost;
    }

    if (params.where) {
      searchParams.where = params.where;
    }

    if (params.sortBy) {
      searchParams.sortBy = params.sortBy;
    }

    if (params.facets) {
      searchParams.facets = params.facets;
    }

    const results = await oramaSearch(db, searchParams as any);

    const hits: SearchHit<SearchDocument>[] = results.hits.map((hit: any) => ({
      id: hit.id,
      score: hit.score,
      document: hit.document as SearchDocument,
    }));

    return {
      count: results.count,
      elapsedTime:
        typeof results.elapsed === "object" && results.elapsed !== null
          ? ((results.elapsed as any).raw ?? 0)
          : Number(results.elapsed ?? 0),
      hits,
      facets: results.facets,
    };
  }

  public async exportIndex(indexName: string): Promise<unknown> {
    const db = this.getIndex(indexName);
    return await oramaSave(db);
  }

  public async importIndex(
    indexName: string,
    serializedData: unknown,
    schema = defaultSearchSchema as unknown as AnySchema,
  ): Promise<AnyOrama> {
    const db = await create({ schema });
    await oramaLoad(db, serializedData as any);
    this.indexes.set(indexName, db);
    return db;
  }
}

export const oramaEngine = new OramaEngine();
