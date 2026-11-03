import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";
import type { ErrorActionsSectionProps } from "@/types/errors";

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
