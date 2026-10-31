import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";

export interface ErrorActionsSectionProps {
  readonly reset?: () => void;
}

export function ErrorActionsSection({ reset }: ErrorActionsSectionProps): ReactNode {
  return (
    <ErrorActions
      primaryAction={
        reset
          ? {
              label: "Try again",
              onClick: reset,
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
