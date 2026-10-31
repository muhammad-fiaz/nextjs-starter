"use client";

import GlobalErrorPage from "@/components/pages/(system)/global-error/page";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GlobalErrorPage error={error} reset={reset} />
      </body>
    </html>
  );
}
