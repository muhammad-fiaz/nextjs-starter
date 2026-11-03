"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type KeyboardEvent, useEffect, useState } from "react";

import { SearchEmptyState } from "@/components/states/search-empty-state";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Spinner } from "@/components/ui/spinner";
import { getLocalizedPath } from "@/i18n/navigation";
import { searchIndexQueryOptions, searchQueryOptions } from "@/query/search-query-options";
import { siteConfig } from "@/site.config";
import { useUIStore } from "@/stores/ui-store";
import type { SearchI18n } from "@/types/i18n";
import type { GlobalSearchDialogProps } from "@/types/search";

export function GlobalSearchDialog({
  currentLocale,
  placeholder,
  limit = 8,
  searchI18n,
}: GlobalSearchDialogProps) {
  const isOpen = useUIStore((state) => state.isSearchOpen);
  const setSearchOpen = useUIStore((state) => state.setSearchOpen);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const activeLocale =
    currentLocale && (siteConfig.i18n.locales as readonly string[]).includes(currentLocale)
      ? currentLocale
      : siteConfig.i18n.defaultLocale;

  const defaultPlaceholder = placeholder || searchI18n?.placeholder;
  const trimmedQuery = query.trim();

  useQuery({
    ...searchIndexQueryOptions(),
    enabled: isOpen,
  });

  const { data, isFetching } = useQuery({
    ...searchQueryOptions({
      term: trimmedQuery,
      limit,
      tolerance: 1,
    }),
    enabled: isOpen && trimmedQuery.length > 0,
  });

  const results = data?.hits ?? [];

  useEffect(() => {
    const down = (event: globalThis.KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen(!useUIStore.getState().isSearchOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setSearchOpen]);

  const handleSelect = (url: string) => {
    setSearchOpen(false);
    router.push(getLocalizedPath(url, activeLocale));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && trimmedQuery) {
      event.preventDefault();
      setSearchOpen(false);
      const searchPath = getLocalizedPath(
        `/search?q=${encodeURIComponent(trimmedQuery)}`,
        activeLocale,
      );
      router.push(searchPath);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSearchOpen(true)}
        className="text-muted-foreground hover:text-foreground hover:bg-accent/60 sm:border-input/60 sm:bg-background/50 relative h-9 w-9 bg-transparent p-0 shadow-none sm:w-64 sm:justify-between sm:border sm:px-3 sm:py-2"
        aria-label="Search"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
          {searchI18n?.triggerText && (
            <span className="hidden text-xs sm:inline-flex">{searchI18n.triggerText}</span>
          )}
        </div>
        <kbd className="bg-muted text-muted-foreground pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={isOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder={defaultPlaceholder}
          value={query}
          onValueChange={setQuery}
          onKeyDown={handleKeyDown}
        />
        <CommandList>
          {isFetching && (
            <div className="flex items-center justify-center py-8">
              <Spinner className="text-muted-foreground size-5" />
            </div>
          )}

          {!isFetching && trimmedQuery !== "" && results.length === 0 && (
            <SearchEmptyState
              title={searchI18n?.emptyTitle || ""}
              description={searchI18n?.emptyDescription || ""}
            />
          )}

          {!isFetching && results.length > 0 && (
            <CommandGroup heading={searchI18n?.suggestionsHeading || ""}>
              {results.map((hit) => (
                <CommandItem
                  key={hit.id}
                  value={`${hit.document.title} ${hit.document.description || ""}`}
                  onSelect={() => handleSelect(hit.document.url || "/")}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden py-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{hit.document.title}</span>
                      <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-normal tracking-wider uppercase">
                        {hit.document.category || hit.document.type}
                      </span>
                    </div>
                    {hit.document.description && (
                      <span className="text-muted-foreground line-clamp-1 text-xs">
                        {hit.document.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!isFetching && !trimmedQuery && searchI18n?.initialPrompt && (
            <div className="text-muted-foreground p-4 text-center text-xs">
              {searchI18n.initialPrompt}
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
