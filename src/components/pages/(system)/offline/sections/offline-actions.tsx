"use client";

import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";

export interface OfflineActionsProps {
  readonly onRetry?: () => void;
}

export function OfflineActions({ onRetry }: OfflineActionsProps): ReactNode {
  return (
    <ErrorActions
      primaryAction={
        onRetry
          ? {
              label: "Try again",
              onClick: onRetry,
              variant: "default",
            }
          : {
              label: "Reload page",
              onClick: () => {
                if (typeof window !== "undefined") window.location.reload();
              },
              variant: "default",
            }
      }
    />
  );
}
