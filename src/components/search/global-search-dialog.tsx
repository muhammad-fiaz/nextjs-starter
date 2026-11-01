"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useEffect, useState, useTransition } from "react";

import { SearchEmptyState } from "@/components/search/search-empty-state";
import { SearchSkeleton } from "@/components/search/search-skeleton";
import { SearchSuggestions } from "@/components/search/search-suggestions";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandInput, CommandList } from "@/components/ui/command";
import { getLocalizedPath } from "@/i18n/navigation";
import { loadClientSearchIndex, searchClient } from "@/lib/search/client/index-loader";
import { siteConfig } from "@/site.config";
import type { DictionaryNavigation, SearchI18n } from "@/types/i18n";
import type { SearchDocument, SearchHit } from "@/types/search";

export interface GlobalSearchDialogProps {
  readonly currentLocale?: string;
  readonly placeholder?: string;
  readonly limit?: number;
  readonly searchI18n?: SearchI18n;
  readonly navigationI18n?: DictionaryNavigation;
}

export function GlobalSearchDialog({
  currentLocale,
  placeholder,
  limit = 8,
  searchI18n,
  navigationI18n,
}: GlobalSearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<readonly SearchHit<SearchDocument>[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const activeLocale =
    currentLocale && siteConfig.i18n.locales.includes(currentLocale as any)
      ? currentLocale
      : siteConfig.i18n.defaultLocale;

  const defaultPlaceholder =
    placeholder || searchI18n?.placeholder || "Search documentation, features, pages...";

  useEffect(() => {
    if (open) {
      loadClientSearchIndex(activeLocale).catch(() => {});
    }
  }, [open, activeLocale]);

  useEffect(() => {
    const down = (e: globalThis.KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setResults([]);
      return;
    }

    startTransition(async () => {
      try {
        const res = await searchClient(activeLocale, {
          term: query,
          limit,
          tolerance: 1,
        });
        setResults(res.hits);
      } catch {
        setResults([]);
      }
    });
  }, [query, open, activeLocale, limit]);

  const handleSelect = (url: string) => {
    setOpen(false);
    const targetUrl = getLocalizedPath(url, activeLocale);
    router.push(targetUrl);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      setOpen(false);
      const encodedQuery = encodeURIComponent(query.trim());
      const searchPath = getLocalizedPath(`/search?q=${encodedQuery}`, activeLocale);
      router.push(searchPath);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground hover:bg-accent/60 sm:border-input/60 sm:bg-background/50 relative h-9 w-9 bg-transparent p-0 shadow-none sm:w-64 sm:justify-between sm:border sm:px-3 sm:py-2"
        aria-label="Search"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 shrink-0 opacity-70" />
          <span className="hidden text-xs sm:inline-flex">
            {searchI18n?.triggerText || "Search documentation..."}
          </span>
        </div>
        <kbd className="bg-muted text-muted-foreground pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={defaultPlaceholder}
          value={query}
          onValueChange={setQuery}
          onKeyDown={handleKeyDown}
        />
        <CommandList>
          {isPending && <SearchSkeleton variant="dialog" count={3} />}

          {!isPending && query.trim() !== "" && results.length === 0 && (
            <SearchEmptyState
              title={searchI18n?.emptyTitle || "No results found"}
              description={
                searchI18n?.emptyDescription || "Try another search term or verify your spelling."
              }
            />
          )}

          {!isPending && results.length > 0 && (
            <SearchSuggestions
              hits={results}
              onSelect={handleSelect}
              heading={searchI18n?.suggestionsHeading || "Suggestions"}
              emptyText={searchI18n?.noSuggestions || "No suggestions available"}
            />
          )}

          {!isPending && !query.trim() && (
            <div className="text-muted-foreground p-4 text-center text-xs">
              {searchI18n?.initialPrompt || "Enter a search term to find content."}
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
