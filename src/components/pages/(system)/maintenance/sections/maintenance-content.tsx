import { Wrench } from "lucide-react";
import type { ReactNode } from "react";

import { ErrorContent } from "@/components/errors/error-content";

export function MaintenanceContent(): ReactNode {
  return (
    <ErrorContent
      title="Under Maintenance"
      description="We are performing essential system updates and improvements. We will be back online shortly."
      icon={<Wrench className="text-muted-foreground h-8 w-8" aria-hidden="true" />}
      showStatusCode={false}
    />
  );
}
