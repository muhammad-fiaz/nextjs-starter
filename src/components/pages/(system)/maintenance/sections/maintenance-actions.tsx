import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";
import type { MaintenanceActionsProps } from "@/types/errors";

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
