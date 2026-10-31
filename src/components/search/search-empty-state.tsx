import { Search } from "lucide-react";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface SearchEmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  readonly title?: string;
  readonly description?: string;
}

/**
 * Reusable empty state component when no search results match.
 */
export function SearchEmptyState({
  title = "No results found",
  description = "Try adjusting your search terms or filters.",
  className,
  ...props
}: SearchEmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center p-8 text-center", className)}
      {...props}
    >
      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
        <Search className="text-muted-foreground h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 text-xs">{description}</p>
    </div>
  );
}
