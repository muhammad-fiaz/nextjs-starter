import type { z } from "zod";

import type { searchDocumentSchema } from "@/validation/search";

export type SearchDocument = z.infer<typeof searchDocumentSchema>;
export type { SearchDocumentInput } from "@/validation/search";

export interface SearchFilterCriteria {
  readonly type?: string | readonly string[];
  readonly category?: string | readonly string[];
  readonly tags?: readonly string[];
  readonly source?: string | readonly string[];
  readonly author?: string;
  readonly locale?: string;
  readonly published?: boolean;
  readonly [field: string]: unknown;
}

export interface SearchSortCriteria {
  readonly property: string;
  readonly order?: "asc" | "desc";
}

export interface SearchQueryRequest {
  readonly term: string;
  readonly limit?: number;
  readonly offset?: number;
  readonly exact?: boolean;
  readonly tolerance?: number;
  readonly properties?: readonly string[];
  readonly boost?: Record<string, number>;
  readonly where?: SearchFilterCriteria;
  readonly sortBy?: SearchSortCriteria;
  readonly facets?: Record<string, Record<string, unknown>>;
}

export interface SearchHit<T = SearchDocument> {
  readonly id: string;
  readonly score: number;
  readonly document: T;
}

export interface SearchResponse<T = SearchDocument> {
  readonly count: number;
  readonly elapsedTime: number;
  readonly hits: readonly SearchHit<T>[];
  readonly facets?: Record<string, unknown>;
}

export interface MultiIndexSearchResponse<T = SearchDocument> {
  readonly count: number;
  readonly elapsedTime: number;
  readonly resultsByIndex: Record<string, readonly SearchHit<T>[]>;
  readonly combinedHits: readonly SearchHit<T>[];
}

export interface SearchPersistenceAdapter {
  save(indexName: string, rawData: unknown): Promise<void>;
  load(indexName: string): Promise<unknown | null>;
}
