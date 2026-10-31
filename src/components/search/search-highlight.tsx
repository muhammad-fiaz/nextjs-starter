import type { HTMLAttributes, ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SearchHighlightProps extends HTMLAttributes<HTMLSpanElement> {
  readonly text: string;
  readonly query?: string;
}

/**
 * Highlights matching search substrings safely without innerHTML.
 */
export function SearchHighlight({
  text,
  query,
  className,
  ...props
}: SearchHighlightProps): ReactNode {
  if (!query || !query.trim()) {
    return (
      <span className={className} {...props}>
        {text}
      </span>
    );
  }

  const trimmedQuery = query.trim().toLowerCase();
  const lowerText = text.toLowerCase();
  const matchIndex = lowerText.indexOf(trimmedQuery);

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
