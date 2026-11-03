import { Search } from "lucide-react";
import type { ReactNode } from "react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import type { SearchEmptyStateProps } from "@/types/search";

export function SearchEmptyState({
  title = "No results found",
  description = "Try adjusting your search terms or filters.",
  className,
  ...props
}: SearchEmptyStateProps): ReactNode {
  return (
    <Empty className={cn("border-none p-8", className)} {...props}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
