import { WifiOff } from "lucide-react";
import type { ReactNode } from "react";

import { ErrorContent } from "@/components/errors/error-content";

export function OfflineContent(): ReactNode {
  return (
    <ErrorContent
      title="You are offline"
      description="It appears your internet connection has been lost. Please verify your connection."
      icon={<WifiOff className="text-muted-foreground h-8 w-8" aria-hidden="true" />}
      showStatusCode={false}
    />
  );
}
