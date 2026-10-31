import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

export type SearchSortOption = "relevance" | "title-asc" | "title-desc";

export interface SearchSortProps {
  readonly value: SearchSortOption;
  readonly onChange: (value: SearchSortOption) => void;
  readonly relevanceLabel?: string;
  readonly titleAscLabel?: string;
  readonly titleDescLabel?: string;
}

export function SearchSort({
  value,
  onChange,
  relevanceLabel = "Relevance",
  titleAscLabel = "Title (A-Z)",
  titleDescLabel = "Title (Z-A)",
}: SearchSortProps): ReactNode {
  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal className="text-muted-foreground h-3.5 w-3.5" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SearchSortOption)}
        className="border-border/60 bg-background text-foreground focus:ring-ring h-9 cursor-pointer rounded-lg border px-3 text-xs font-medium shadow-2xs outline-none focus:ring-1"
        aria-label="Sort search results"
      >
        <option value="relevance">{relevanceLabel}</option>
        <option value="title-asc">{titleAscLabel}</option>
        <option value="title-desc">{titleDescLabel}</option>
      </select>
    </div>
  );
}
