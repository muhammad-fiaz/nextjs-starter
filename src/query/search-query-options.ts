import { queryOptions } from "@tanstack/react-query";

import { loadClientSearchIndex, searchClient } from "@/lib/search/index-loader";
import type { SearchQueryRequest } from "@/types/search";

export const searchKeys = {
  all: ["search"] as const,
  index: () => ["search", "index"] as const,
  query: (request: SearchQueryRequest) => ["search", request] as const,
};

export function searchIndexQueryOptions() {
  return queryOptions({
    queryKey: searchKeys.index(),
    queryFn: () => loadClientSearchIndex(),
    staleTime: Infinity,
  });
}

export function searchQueryOptions(request: SearchQueryRequest) {
  return queryOptions({
    queryKey: searchKeys.query(request),
    queryFn: () => searchClient(request),
    enabled: request.term.trim().length > 0,
    staleTime: 30 * 1000,
  });
}
