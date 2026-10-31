import { cn } from "cn";
import { Search } from "lucide-react";
import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";

export interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  readonly placeholder?: string;
  readonly className?: string;
  readonly autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onKeyDown,
  placeholder = "Search...",
  className,
  autoFocus = false,
}: SearchInputProps): ReactNode {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 opacity-70" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="h-11 w-full rounded-xl pr-4 pl-10 text-sm shadow-xs focus-visible:ring-1"
        aria-label={placeholder}
      />
    </div>
  );
}
