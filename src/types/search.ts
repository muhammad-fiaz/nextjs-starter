import type { AnySchema } from "@orama/orama";
import type { HTMLAttributes, KeyboardEvent as ReactKeyboardEvent } from "react";
import type { z } from "zod";

import type { SearchI18n } from "@/types/i18n";
import type { searchDocumentSchema } from "@/validation/search";

export type SearchDocument = z.infer<typeof searchDocumentSchema>;
export type SearchDocumentInput = z.input<typeof searchDocumentSchema>;

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

export interface SearchPersistenceAdapter {
  save(indexName: string, rawData: unknown): Promise<void>;
  load(indexName: string): Promise<unknown | null>;
}

export interface CreateIndexOptions {
  readonly name: string;
  readonly schema?: AnySchema;
  readonly language?: string;
}

export type SearchSortOption = "relevance" | "title-asc" | "title-desc";

export interface SearchEmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  readonly title?: string;
  readonly description?: string;
}

export interface SearchFiltersProps {
  readonly types: readonly string[];
  readonly selectedType: string;
  readonly onSelectType: (type: string) => void;
  readonly onClearFilters: () => void;
  readonly filtersHeading?: string;
  readonly allLabel?: string;
  readonly clearLabel?: string;
}

export interface SearchHighlightProps extends HTMLAttributes<HTMLSpanElement> {
  readonly text: string;
  readonly query?: string;
}

export interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onKeyDown?: (event: ReactKeyboardEvent<HTMLInputElement>) => void;
  readonly placeholder?: string;
  readonly className?: string;
  readonly autoFocus?: boolean;
}

export interface SearchPaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly previousLabel?: string;
  readonly nextLabel?: string;
  readonly pageLabel?: string;
}

export interface SearchSortProps {
  readonly value: SearchSortOption;
  readonly onChange: (value: SearchSortOption) => void;
  readonly relevanceLabel?: string;
  readonly titleAscLabel?: string;
  readonly titleDescLabel?: string;
}

export interface GlobalSearchDialogProps {
  readonly currentLocale?: string;
  readonly placeholder?: string;
  readonly limit?: number;
  readonly searchI18n?: SearchI18n;
}
