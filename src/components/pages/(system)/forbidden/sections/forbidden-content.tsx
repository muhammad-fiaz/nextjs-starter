import { ShieldX } from "lucide-react";
import type { ReactNode } from "react";

import { ErrorContent } from "@/components/errors/error-content";

export function ForbiddenContent(): ReactNode {
  return (
    <ErrorContent
      statusCode={403}
      title="Access Denied"
      description="You do not have permission to access this resource or view this content."
      icon={<ShieldX className="text-destructive h-8 w-8" aria-hidden="true" />}
      showStatusCode={true}
    />
  );
}
