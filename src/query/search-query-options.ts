import { queryOptions } from "@tanstack/react-query";

import type { SearchQueryRequest } from "@/types/search";

export const searchKeys = {
  all: ["search"] as const,
  index: (indexName: string) => ["search", indexName] as const,
  query: (indexName: string, query: SearchQueryRequest) => ["search", indexName, query] as const,
  global: (indexes: readonly string[], query: SearchQueryRequest) =>
    ["search", "global", indexes, query] as const,
};

export function createSearchQueryOptions(
  indexName: string,
  query: SearchQueryRequest,
  fetcher: (indexName: string, query: SearchQueryRequest) => Promise<any>,
) {
  return queryOptions({
    queryKey: searchKeys.query(indexName, query),
    queryFn: () => fetcher(indexName, query),
    enabled: Boolean(query.term && query.term.trim().length > 0),
    staleTime: 30 * 1000,
  });
}
