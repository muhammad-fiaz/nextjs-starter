import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";
import { cn } from "@/lib/utils";
import type { SystemStateProps } from "@/types/errors";

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  children,
}: SystemStateProps): ReactNode {
  return (
    <div
      className={cn(
        "border-border flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center",
        className,
      )}
    >
      {icon && <div className="text-muted-foreground mb-4">{icon}</div>}
      <h3 className="text-foreground text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-1.5 max-w-sm text-sm">{description}</p>
      )}
      {action && (
        <div className="mt-5">
          <ErrorActions primaryAction={action} />
        </div>
      )}
      {children}
    </div>
  );
}
