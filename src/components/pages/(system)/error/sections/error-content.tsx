import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

import { ErrorContent } from "@/components/errors/error-content";

export function ErrorSectionContent(): ReactNode {
  return (
    <ErrorContent
      statusCode={500}
      title="Something went wrong"
      description="An unexpected error occurred while processing your request. Please try again or return home."
      icon={<AlertTriangle className="text-destructive h-8 w-8" aria-hidden="true" />}
      showStatusCode={true}
    />
  );
}
