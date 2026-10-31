"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { SystemPageAction } from "@/types/errors";

export interface ErrorActionsProps {
  readonly primaryAction?: SystemPageAction;
  readonly secondaryAction?: SystemPageAction;
}

export function ErrorActions({ primaryAction, secondaryAction }: ErrorActionsProps): ReactNode {
  if (!primaryAction && !secondaryAction) {
    return null;
  }

  const renderAction = (action: SystemPageAction, isPrimary: boolean) => {
    const buttonVariant = action.variant || (isPrimary ? "default" : "outline");

    if (action.href) {
      return (
        <Link key={action.label} href={action.href} className="inline-flex">
          <Button variant={buttonVariant}>{action.label}</Button>
        </Link>
      );
    }

    return (
      <Button key={action.label} variant={buttonVariant} onClick={action.onClick}>
        {action.label}
      </Button>
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      {primaryAction && renderAction(primaryAction, true)}
      {secondaryAction && renderAction(secondaryAction, false)}
    </div>
  );
}
