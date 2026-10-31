import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface SearchResultItemProps extends HTMLAttributes<HTMLDivElement> {
  readonly title: string;
  readonly description?: string;
  readonly category?: string;
  readonly url?: string;
  readonly icon?: ReactNode;
  readonly isSelected?: boolean;
  readonly onSelect?: () => void;
}

/**
 * Reusable presentational component for individual search result items.
 * Works in both server and client rendering contexts.
 */
export function SearchResultItem({
  title,
  description,
  category,
  icon,
  isSelected,
  onSelect,
  className,
  ...props
}: SearchResultItemProps) {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      className={cn(
        "group relative flex cursor-pointer items-center rounded-sm px-3 py-2.5 text-sm transition-colors outline-none select-none",
        isSelected
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50 hover:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {icon && <div className="text-muted-foreground mr-2.5 shrink-0">{icon}</div>}
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{title}</span>
          {category && (
            <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-normal tracking-wider uppercase">
              {category}
            </span>
          )}
        </div>
        {description && (
          <span className="text-muted-foreground line-clamp-1 text-xs">{description}</span>
        )}
      </div>
    </div>
  );
}
