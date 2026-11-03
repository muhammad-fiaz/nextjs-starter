"use client";

import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";
import type { OfflineActionsProps } from "@/types/errors";

export function OfflineActions({ onRetry, retryLabel }: OfflineActionsProps): ReactNode {
  return (
    <ErrorActions
      primaryAction={
        onRetry
          ? {
              label: retryLabel || "Try again",
              onClick: onRetry,
              variant: "default",
            }
          : {
              label: retryLabel || "Reload page",
              onClick: () => {
                if (typeof window !== "undefined") window.location.reload();
              },
              variant: "default",
            }
      }
    />
  );
}
