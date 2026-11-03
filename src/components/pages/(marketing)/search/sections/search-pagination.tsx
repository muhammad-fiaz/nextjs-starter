import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { SearchPaginationProps } from "@/types/search";

export function SearchPagination({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel = "Previous",
  nextLabel = "Next",
  pageLabel = "Page",
}: SearchPaginationProps): ReactNode {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="border-border/60 flex items-center justify-between border-t pt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="gap-1 text-xs"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {previousLabel}
      </Button>

      <span className="text-muted-foreground text-xs font-medium">
        {pageLabel} {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="gap-1 text-xs"
      >
        {nextLabel}
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
