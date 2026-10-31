import { Filter, X } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface SearchFiltersProps {
  readonly types: readonly string[];
  readonly selectedType: string;
  readonly onSelectType: (type: string) => void;
  readonly onClearFilters: () => void;
  readonly filtersHeading?: string;
  readonly allLabel?: string;
  readonly clearLabel?: string;
}

export function SearchFilters({
  types,
  selectedType,
  onSelectType,
  onClearFilters,
  filtersHeading = "Filters",
  allLabel = "All Content",
  clearLabel = "Clear all filters",
}: SearchFiltersProps): ReactNode {
  // Only render filter panel if actual indexed types exist
  if (types.length === 0) {
    return null;
  }

  const hasActiveFilter = selectedType !== "all";

  return (
    <div className="border-border/60 bg-card space-y-4 rounded-xl border p-5 shadow-xs">
      <div className="flex items-center justify-between border-b pb-3">
        <span className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
          <Filter className="h-3.5 w-3.5" />
          {filtersHeading}
        </span>
        {hasActiveFilter && (
          <button
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-[11px] underline transition-colors"
          >
            <X className="h-3 w-3" />
            {clearLabel}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Button
          variant={selectedType === "all" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onSelectType("all")}
          className="h-8 justify-start text-xs font-medium"
        >
          {allLabel}
        </Button>
        {types.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onSelectType(type)}
            className="h-8 justify-between text-xs font-normal capitalize"
          >
            <span>{type}</span>
            <Badge variant="outline" className="h-4 px-1 py-0 font-mono text-[10px] uppercase">
              {type}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
}
