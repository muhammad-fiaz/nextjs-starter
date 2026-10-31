import { FileQuestion } from "lucide-react";
import type { ReactNode } from "react";

import { ErrorContent } from "@/components/errors/error-content";

export function NotFoundContent(): ReactNode {
  return (
    <ErrorContent
      statusCode={404}
      title="Page not found"
      description="The page you are looking for doesn't exist, has been removed, or is temporarily unavailable."
      icon={<FileQuestion className="h-8 w-8" aria-hidden="true" />}
      showStatusCode={true}
    />
  );
}
