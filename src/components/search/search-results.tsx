import type { HTMLAttributes, ReactNode } from "react";

import { SearchResultItem } from "@/components/search/search-result-item";
import { cn } from "@/lib/utils";
import type { SearchDocument, SearchHit } from "@/types/search";

export interface SearchResultsProps extends HTMLAttributes<HTMLDivElement> {
  readonly hits: readonly SearchHit<SearchDocument>[];
  readonly heading?: string;
  readonly onSelectResult?: (hit: SearchHit<SearchDocument>) => void;
  readonly renderCustomItem?: (hit: SearchHit<SearchDocument>) => ReactNode;
}

/**
 * Reusable list component for rendering structured search results.
 */
export function SearchResults({
  hits,
  heading,
  onSelectResult,
  renderCustomItem,
  className,
  ...props
}: SearchResultsProps) {
  if (hits.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-1 p-1", className)} {...props}>
      {heading && (
        <span className="text-muted-foreground px-2 py-1 text-[11px] font-semibold tracking-wider uppercase">
          {heading}
        </span>
      )}
      {hits.map((hit) => {
        if (renderCustomItem) {
          return <div key={hit.id}>{renderCustomItem(hit)}</div>;
        }

        return (
          <SearchResultItem
            key={hit.id}
            title={hit.document.title}
            description={hit.document.description || hit.document.content}
            category={hit.document.category || hit.document.type}
            url={hit.document.url}
            onSelect={() => onSelectResult?.(hit)}
          />
        );
      })}
    </div>
  );
}
