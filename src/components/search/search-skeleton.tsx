import { cn } from "cn";

import { Skeleton } from "@/components/ui/skeleton";

interface SearchSkeletonProps {
  readonly variant?: "dialog" | "page";
  readonly count?: number;
  readonly className?: string;
}

export function SearchSkeleton({ variant = "dialog", count = 3, className }: SearchSkeletonProps) {
  if (variant === "page") {
    return (
      <div className={cn("w-full space-y-4", className)} aria-label="Loading search results">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="border-border/60 bg-card space-y-3 rounded-xl border p-5 shadow-xs"
          >
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-48 rounded" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2 p-2", className)} aria-label="Loading search suggestions">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <Skeleton className="h-4 w-4 shrink-0 rounded" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-3 w-56 rounded" />
          </div>
          <Skeleton className="h-4 w-12 rounded" />
        </div>
      ))}
    </div>
  );
}
