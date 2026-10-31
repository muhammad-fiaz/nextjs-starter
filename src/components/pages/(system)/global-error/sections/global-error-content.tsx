import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

import { ErrorContent } from "@/components/errors/error-content";

export function GlobalErrorSectionContent(): ReactNode {
  return (
    <ErrorContent
      statusCode={500}
      title="Critical Application Error"
      description="The application encountered an unrecoverable error at the root level. Please reload the page."
      icon={<ShieldAlert className="text-destructive h-10 w-10" aria-hidden="true" />}
      showStatusCode={true}
    />
  );
}
