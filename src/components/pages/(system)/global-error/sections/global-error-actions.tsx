"use client";

import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";

export interface GlobalErrorActionsSectionProps {
  readonly reset?: () => void;
}

export function GlobalErrorActionsSection({ reset }: GlobalErrorActionsSectionProps): ReactNode {
  return (
    <ErrorActions
      primaryAction={{
        label: "Reload Application",
        onClick: () => {
          if (reset) {
            reset();
          } else if (typeof window !== "undefined") {
            window.location.reload();
          }
        },
        variant: "default",
      }}
    />
  );
}
