import type { UnauthorizedPageProps } from "@/types/errors";

import { UnauthorizedActions } from "./sections/unauthorized-actions";
import { UnauthorizedContent } from "./sections/unauthorized-content";

export default function UnauthorizedPage({ loginHref }: UnauthorizedPageProps) {
  return (
    <main className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <UnauthorizedContent />
        <UnauthorizedActions loginHref={loginHref} />
      </div>
    </main>
  );
}
