import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";

export interface ServiceUnavailableActionsProps {
  readonly onRetry?: () => void;
}

export function ServiceUnavailableActions({ onRetry }: ServiceUnavailableActionsProps): ReactNode {
  return (
    <ErrorActions
      primaryAction={
        onRetry
          ? {
              label: "Retry",
              onClick: onRetry,
              variant: "default",
            }
          : undefined
      }
      secondaryAction={{
        label: "Return home",
        href: "/",
        variant: "outline",
      }}
    />
  );
}
