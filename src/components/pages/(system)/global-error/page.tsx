"use client";

import { GlobalErrorActionsSection } from "./sections/global-error-actions";
import { GlobalErrorSectionContent } from "./sections/global-error-content";

export interface GlobalErrorPageProps {
  readonly error?: Error & { digest?: string };
  readonly reset?: () => void;
}

export default function GlobalErrorPage({ reset }: GlobalErrorPageProps) {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <GlobalErrorSectionContent />
        <GlobalErrorActionsSection reset={reset} />
      </div>
    </div>
  );
}
