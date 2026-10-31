import type { ReactNode } from "react";

import { CommandGroup, CommandItem } from "@/components/ui/command";
import type { SearchDocument, SearchHit } from "@/types/search";

export interface SearchSuggestionsProps {
  readonly hits: readonly SearchHit<SearchDocument>[];
  readonly onSelect: (url: string) => void;
  readonly heading?: string;
  readonly emptyText?: string;
}

export function SearchSuggestions({
  hits,
  onSelect,
  heading = "Suggestions",
  emptyText = "No suggestions available",
}: SearchSuggestionsProps): ReactNode {
  if (hits.length === 0) {
    return <div className="text-muted-foreground py-4 text-center text-xs">{emptyText}</div>;
  }

  return (
    <CommandGroup heading={heading}>
      {hits.map((hit) => (
        <CommandItem
          key={hit.id}
          value={`${hit.document.title} ${hit.document.description || ""}`}
          onSelect={() => onSelect(hit.document.url || "/")}
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
  );
}
