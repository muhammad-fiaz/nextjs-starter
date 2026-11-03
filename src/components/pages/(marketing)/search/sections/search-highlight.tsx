import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { SearchHighlightProps } from "@/types/search";

export function SearchHighlight({
  text,
  query,
  className,
  ...props
}: SearchHighlightProps): ReactNode {
  const trimmedQuery = query?.trim().toLowerCase() ?? "";

  if (!trimmedQuery) {
    return (
      <span className={className} {...props}>
        {text}
      </span>
    );
  }

  const matchIndex = text.toLowerCase().indexOf(trimmedQuery);

  if (matchIndex === -1) {
    return (
      <span className={className} {...props}>
        {text}
      </span>
    );
  }

  const before = text.slice(0, matchIndex);
  const matched = text.slice(matchIndex, matchIndex + trimmedQuery.length);
  const after = text.slice(matchIndex + trimmedQuery.length);

  return (
    <span className={className} {...props}>
      {before}
      <mark className="bg-primary/20 text-primary rounded-xs px-0.5 font-semibold">{matched}</mark>
      {after}
    </span>
  );
}
