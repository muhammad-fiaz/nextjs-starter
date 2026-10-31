import type { ReactNode } from "react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  readonly label?: string;
  readonly className?: string;
}

export function LoadingState({ label = "Loading...", className }: LoadingStateProps): ReactNode {
  return (
    <div
      className={cn(
        "flex min-h-[250px] flex-col items-center justify-center space-y-3 p-8 text-center",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Spinner className="text-primary h-8 w-8 animate-spin" />
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
    </div>
  );
}
