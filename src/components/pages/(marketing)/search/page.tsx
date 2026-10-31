"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useMemo, useState, useTransition } from "react";

import { SearchEmptyState } from "@/components/search/search-empty-state";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchHighlight } from "@/components/search/search-highlight";
import { SearchInput } from "@/components/search/search-input";
import { SearchPagination } from "@/components/search/search-pagination";
import { SearchSkeleton } from "@/components/search/search-skeleton";
import { SearchSort, type SearchSortOption } from "@/components/search/search-sort";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLocalizedPath } from "@/i18n/navigation";
import type { SearchI18n } from "@/i18n/types";
import { searchClient } from "@/lib/search/client/index-loader";
import type { SearchDocument, SearchHit } from "@/types/search";

export interface DedicatedSearchPageProps {
  readonly locale: string;
  readonly searchI18n: SearchI18n;
  readonly initialQuery?: string;
}

export default function SearchPage({
  locale,
  searchI18n,
  initialQuery = "",
}: DedicatedSearchPageProps): ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read query from URL or prop fallback
  const urlQuery = searchParams.get("q") ?? initialQuery;

  const [query, setQuery] = useState(urlQuery);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SearchSortOption>("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [hits, setHits] = useState<readonly SearchHit<SearchDocument>[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isSearching, startTransition] = useTransition();

  const pageSize = 5;

  // Sync state if URL query param changes from external navigation
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Execute search via in-memory Orama client
  const runSearch = useCallback(
    (searchTerm: string) => {
      setHasError(false);
      startTransition(async () => {
        try {
          if (!searchTerm.trim()) {
            setHits([]);
            setCurrentPage(1);
            return;
          }

          const res = await searchClient(locale, {
            term: searchTerm.trim(),
            limit: 50,
            tolerance: 1,
          });
          setHits(res.hits);
          setCurrentPage(1);
        } catch {
          setHits([]);
          setHasError(true);
        }
      });
    },
    [locale],
  );

  useEffect(() => {
    runSearch(query);
  }, [query, runSearch]);

  // Handle query submission and synchronize URL
  const handleQuerySubmit = (newQuery: string) => {
    const trimmed = newQuery.trim();
    const encoded = encodeURIComponent(trimmed);
    const newPath = trimmed
      ? getLocalizedPath(`/search?q=${encoded}`, locale)
      : getLocalizedPath("/search", locale);

    router.push(newPath);
    setQuery(newQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleQuerySubmit(query);
    }
  };

  // Extract actual unique types present in the indexed hits for filtering
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    for (const hit of hits) {
      if (hit.document.type) {
        types.add(hit.document.type);
      }
    }
    return Array.from(types);
  }, [hits]);

  // Apply active filters and sorting
  const processedHits = useMemo(() => {
    let result = [...hits];

    // Filter by type
    if (selectedType !== "all") {
      result = result.filter(
        (hit) => hit.document.type.toLowerCase() === selectedType.toLowerCase(),
      );
    }

    // Sort
    if (sortBy === "title-asc") {
      result.sort((a, b) => a.document.title.localeCompare(b.document.title));
    } else if (sortBy === "title-desc") {
      result.sort((a, b) => b.document.title.localeCompare(a.document.title));
    }

    return result;
  }, [hits, selectedType, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(processedHits.length / pageSize));
  const paginatedHits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedHits.slice(start, start + pageSize);
  }, [processedHits, currentPage, pageSize]);

  return (
    <main className="min-h-[calc(100vh-16rem)] w-full px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{searchI18n.title}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{searchI18n.pageDescription}</p>
        </div>

        {/* Search Input Bar */}
        <SearchInput
          value={query}
          onChange={(val) => {
            setQuery(val);
          }}
          onKeyDown={handleKeyDown}
          placeholder={searchI18n.placeholder}
          className="max-w-3xl"
        />

        {/* Content Layout: Filters Sidebar + Results Area */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Filters - rendered only if real types exist */}
          {availableTypes.length > 0 && (
            <aside className="space-y-6 lg:col-span-1">
              <SearchFilters
                types={availableTypes}
                selectedType={selectedType}
                onSelectType={(type) => {
                  setSelectedType(type);
                  setCurrentPage(1);
                }}
                onClearFilters={() => {
                  setSelectedType("all");
                  setCurrentPage(1);
                }}
                filtersHeading={searchI18n.filtersHeading}
                allLabel={searchI18n.allFilter}
                clearLabel={searchI18n.clearFiltersText}
              />
            </aside>
          )}

          {/* Results Area */}
          <div
            className={`space-y-6 ${availableTypes.length > 0 ? "lg:col-span-3" : "lg:col-span-4"}`}
          >
            {/* Results Header: Count & Sort */}
            <div className="border-border/60 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div className="text-muted-foreground text-sm">
                {!isSearching && (
                  <span>
                    <strong className="text-foreground font-semibold">
                      {processedHits.length}
                    </strong>{" "}
                    {searchI18n.resultsFoundText}
                  </span>
                )}
              </div>

              {processedHits.length > 1 && (
                <SearchSort
                  value={sortBy}
                  onChange={(val) => {
                    setSortBy(val);
                    setCurrentPage(1);
                  }}
                  relevanceLabel={searchI18n.relevanceSort}
                  titleAscLabel={searchI18n.titleAscSort}
                  titleDescLabel={searchI18n.titleDescSort}
                />
              )}
            </div>

            {/* Loading State: Skeletons (No spinners) */}
            {isSearching && <SearchSkeleton variant="page" count={3} />}

            {/* Error State with localized retry */}
            {!isSearching && hasError && (
              <div className="border-destructive/20 bg-destructive/10 space-y-3 rounded-xl border p-6 text-center">
                <AlertCircle className="text-destructive mx-auto h-8 w-8" />
                <p className="text-sm font-medium">An error occurred during search.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runSearch(query)}
                  className="gap-2"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </Button>
              </div>
            )}

            {/* Empty Query Prompt */}
            {!isSearching && !hasError && !query.trim() && (
              <div className="border-border/60 bg-card rounded-2xl border p-12 text-center shadow-xs">
                <p className="text-muted-foreground text-sm">
                  {searchI18n.initialPrompt || "Enter a search term to find content."}
                </p>
              </div>
            )}

            {/* No Results Found */}
            {!isSearching && !hasError && query.trim() !== "" && processedHits.length === 0 && (
              <SearchEmptyState
                title={searchI18n.emptyTitle}
                description={searchI18n.emptyDescription}
              />
            )}

            {/* Results List */}
            {!isSearching && !hasError && paginatedHits.length > 0 && (
              <div className="space-y-4">
                {paginatedHits.map((hit) => {
                  const targetHref = getLocalizedPath(hit.document.url || "/", locale);
                  return (
                    <Card
                      key={hit.id}
                      className="group border-border/60 hover:border-foreground/30 transition-all hover:shadow-xs"
                    >
                      <CardContent className="space-y-2 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <Link href={targetHref} className="block space-y-1">
                            <h2 className="group-hover:text-primary text-base font-semibold tracking-tight transition-colors">
                              <SearchHighlight text={hit.document.title} query={query} />
                            </h2>
                            {hit.document.description && (
                              <p className="text-muted-foreground line-clamp-2 text-xs sm:text-sm">
                                <SearchHighlight text={hit.document.description} query={query} />
                              </p>
                            )}
                          </Link>
                          {hit.document.category && (
                            <Badge
                              variant="secondary"
                              className="shrink-0 px-2 py-0.5 font-mono text-[10px] uppercase"
                            >
                              {hit.document.category}
                            </Badge>
                          )}
                        </div>

                        <div className="text-muted-foreground flex items-center gap-3 pt-2 font-mono text-[11px]">
                          <span>{hit.document.url}</span>
                          {hit.document.type && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{hit.document.type}</span>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Pagination */}
                <SearchPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  previousLabel={searchI18n.previousPageText}
                  nextLabel={searchI18n.nextPageText}
                  pageLabel={searchI18n.pageIndicatorText}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
