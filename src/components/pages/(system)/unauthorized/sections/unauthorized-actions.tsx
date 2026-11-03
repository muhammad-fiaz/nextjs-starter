import type { ReactNode } from "react";

import { ErrorActions } from "@/components/errors/error-actions";
import type { UnauthorizedActionsProps } from "@/types/errors";

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
