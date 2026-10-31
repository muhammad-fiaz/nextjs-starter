import { WifiOff } from "lucide-react";
import type { ReactNode } from "react";

import { SystemPage } from "@/components/errors/system-page";
import type { SystemPageAction } from "@/types/errors";

export interface OfflineStateProps {
  readonly onRetry?: () => void;
  readonly className?: string;
}

export function OfflineState({ onRetry, className }: OfflineStateProps): ReactNode {
  const retryAction: SystemPageAction | undefined = onRetry
    ? {
        label: "Check connection",
        onClick: onRetry,
        variant: "default",
      }
    : undefined;

  return (
    <SystemPage
      variant="network-error"
      title="No internet connection"
      description="You appear to be offline. Please check your network cables or Wi-Fi settings and try again."
      icon={<WifiOff className="h-8 w-8" aria-hidden="true" />}
      primaryAction={retryAction}
      showStatusCode={false}
      className={className}
    />
  );
}
