import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { SearchSortOption, SearchSortProps } from "@/types/search";

export function SearchSort({
  value,
  onChange,
  relevanceLabel = "Relevance",
  titleAscLabel = "Title (A-Z)",
  titleDescLabel = "Title (Z-A)",
}: SearchSortProps): ReactNode {
  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal className="text-muted-foreground h-3.5 w-3.5" aria-hidden="true" />
      <NativeSelect
        size="sm"
        value={value}
        onChange={(event) => onChange(event.target.value as SearchSortOption)}
        aria-label="Sort search results"
        className="[&_select]:h-9 [&_select]:rounded-lg [&_select]:text-xs [&_select]:font-medium"
      >
        <NativeSelectOption value="relevance">{relevanceLabel}</NativeSelectOption>
        <NativeSelectOption value="title-asc">{titleAscLabel}</NativeSelectOption>
        <NativeSelectOption value="title-desc">{titleDescLabel}</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
