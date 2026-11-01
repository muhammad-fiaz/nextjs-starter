import { WifiOff } from "lucide-react";
import type { ReactNode } from "react";

import { ErrorContent } from "@/components/errors/error-content";

export interface OfflineContentProps {
  readonly title?: string;
  readonly description?: string;
}

export function OfflineContent({
  title = "You are offline",
  description = "It appears your internet connection has been lost. Please verify your connection.",
}: OfflineContentProps = {}): ReactNode {
  return (
    <ErrorContent
      title={title}
      description={description}
      icon={<WifiOff className="text-muted-foreground h-8 w-8" aria-hidden="true" />}
      showStatusCode={false}
    />
  );
}
