import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";

export interface MaintenanceActionsProps {
  readonly onCheckStatus?: () => void;
}

export function MaintenanceActions({ onCheckStatus }: MaintenanceActionsProps): ReactNode {
  if (!onCheckStatus) return null;

  return (
    <ErrorActions
      primaryAction={{
        label: "Check status",
        onClick: onCheckStatus,
        variant: "outline",
      }}
    />
  );
}
