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

export interface OfflineStateProps {
  readonly onRetry?: () => void;
  readonly className?: string;
}

export interface LoadingStateProps {
  readonly label?: string;
  readonly className?: string;
}

export interface ErrorContentProps {
  readonly title: string;
  readonly description?: string;
  readonly statusCode?: number | string;
  readonly icon?: ReactNode;
  readonly showStatusCode?: boolean;
}

export interface ErrorActionsProps {
  readonly primaryAction?: SystemPageAction;
  readonly secondaryAction?: SystemPageAction;
}

export interface ErrorPageProps {
  readonly error?: Error & { digest?: string };
  readonly reset?: () => void;
}

export interface GlobalErrorPageProps {
  readonly error?: Error & { digest?: string };
  readonly reset?: () => void;
}

export interface MaintenancePageProps {
  readonly onCheckStatus?: () => void;
}

export interface OfflinePageProps {
  readonly onRetry?: () => void;
  readonly title?: string;
  readonly description?: string;
  readonly retryAction?: string;
}

export interface ServiceUnavailablePageProps {
  readonly onRetry?: () => void;
}

export interface UnauthorizedPageProps {
  readonly loginHref?: string;
}

export interface ErrorActionsSectionProps {
  readonly reset?: () => void;
}

export interface GlobalErrorActionsSectionProps {
  readonly reset?: () => void;
}

export interface MaintenanceActionsProps {
  readonly onCheckStatus?: () => void;
}

export interface OfflineActionsProps {
  readonly onRetry?: () => void;
  readonly retryLabel?: string;
}

export interface OfflineContentProps {
  readonly title?: string;
  readonly description?: string;
}

export interface ServiceUnavailableActionsProps {
  readonly onRetry?: () => void;
}

export interface UnauthorizedActionsProps {
  readonly loginHref?: string;
}
