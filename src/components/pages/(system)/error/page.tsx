"use client";

import type { ErrorPageProps } from "@/types/errors";

import { ErrorActionsSection } from "./sections/error-actions";
import { ErrorSectionContent } from "./sections/error-content";

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <ErrorSectionContent />
        <ErrorActionsSection reset={reset} />
      </div>
    </main>
  );
}
