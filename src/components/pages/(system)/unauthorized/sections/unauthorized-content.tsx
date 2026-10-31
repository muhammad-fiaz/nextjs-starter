import { Lock } from "lucide-react";
import type { ReactNode } from "react";

import { ErrorContent } from "@/components/errors/error-content";

export function UnauthorizedContent(): ReactNode {
  return (
    <ErrorContent
      statusCode={401}
      title="Authentication Required"
      description="You must be signed in with valid credentials to access this protected area."
      icon={<Lock className="text-muted-foreground h-8 w-8" aria-hidden="true" />}
      showStatusCode={true}
    />
  );
}
