import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ErrorContentProps } from "@/types/errors";

export function ErrorContent({
  title,
  description,
  statusCode,
  icon,
  showStatusCode = true,
}: ErrorContentProps): ReactNode {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      {icon && (
        <div className="bg-muted text-foreground flex h-16 w-16 items-center justify-center rounded-full">
          {icon}
        </div>
      )}

      {showStatusCode && statusCode && (
        <span className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          Error {statusCode}
        </span>
      )}

      <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h1>

      {description && (
        <p className="text-muted-foreground max-w-md text-base sm:text-lg">{description}</p>
      )}
    </div>
  );
}
