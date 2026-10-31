import type { ReactNode } from "react";

export type SystemPageVariant =
  | "not-found"
  | "server-error"
  | "access-denied"
  | "unauthorized"
  | "service-unavailable"
  | "maintenance"
  | "network-error"
  | "generic";

export type SystemPageLayout = "default" | "centered" | "full-screen" | "minimal";

export interface SystemPageAction {
  readonly label: string;
  readonly href?: string;
  readonly onClick?: () => void;
  readonly variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

export interface SystemPageProps {
  readonly variant?: SystemPageVariant;
  readonly layout?: SystemPageLayout;
  readonly statusCode?: number | string;
  readonly title?: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly primaryAction?: SystemPageAction;
  readonly secondaryAction?: SystemPageAction;
  readonly showStatusCode?: boolean;
  readonly className?: string;
  readonly children?: ReactNode;
}

export interface SystemStateProps {
  readonly title: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly action?: SystemPageAction;
  readonly className?: string;
  readonly children?: ReactNode;
}
