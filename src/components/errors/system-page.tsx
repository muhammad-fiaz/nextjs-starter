import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";
import { ErrorContent } from "@/components/errors/error-content";
import { cn } from "@/lib/utils";
import type { SystemPageProps } from "@/types/errors";

export function SystemPage({
  variant = "generic",
  layout = "default",
  statusCode,
  title = "An unexpected condition occurred",
  description,
  icon,
  primaryAction,
  secondaryAction,
  showStatusCode = true,
  className,
  children,
}: SystemPageProps): ReactNode {
  const containerClasses = cn(
    "flex flex-col items-center justify-center p-6 transition-colors sm:p-10",
    layout === "full-screen" && "bg-background min-h-screen w-full",
    layout === "centered" && "min-h-[70vh] w-full",
    layout === "minimal" && "p-4",
    layout === "default" && "mx-auto my-auto min-h-[60vh] w-full max-w-xl",
    className,
  );

  return (
    <div className={containerClasses} role="alert" aria-live="assertive">
      <div className="flex w-full flex-col items-center space-y-6">
        <ErrorContent
          title={title}
          description={description}
          statusCode={statusCode}
          icon={icon}
          showStatusCode={showStatusCode}
        />
        <ErrorActions primaryAction={primaryAction} secondaryAction={secondaryAction} />
        {children}
      </div>
    </div>
  );
}
