import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";

export interface UnauthorizedActionsProps {
  readonly loginHref?: string;
}

export function UnauthorizedActions({ loginHref = "/login" }: UnauthorizedActionsProps): ReactNode {
  return (
    <ErrorActions
      primaryAction={{
        label: "Sign in",
        href: loginHref,
        variant: "default",
      }}
      secondaryAction={{
        label: "Return home",
        href: "/",
        variant: "outline",
      }}
    />
  );
}
