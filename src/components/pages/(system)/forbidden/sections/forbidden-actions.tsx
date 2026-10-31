import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";

export function ForbiddenActions(): ReactNode {
  return (
    <ErrorActions
      primaryAction={{
        label: "Return home",
        href: "/",
        variant: "default",
      }}
    />
  );
}
