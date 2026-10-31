import { ServerOff } from "lucide-react";
import type { ReactNode } from "react";

import { ErrorContent } from "@/components/errors/error-content";

export function ServiceUnavailableContent(): ReactNode {
  return (
    <ErrorContent
      statusCode={503}
      title="Service Unavailable"
      description="The server is temporarily unable to handle your request due to scheduled maintenance or capacity overload."
      icon={<ServerOff className="h-8 w-8 text-amber-500" aria-hidden="true" />}
      showStatusCode={true}
    />
  );
}
