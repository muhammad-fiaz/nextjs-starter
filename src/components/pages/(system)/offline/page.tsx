import { OfflineActions } from "./sections/offline-actions";
import { OfflineContent } from "./sections/offline-content";

export interface OfflinePageProps {
  readonly onRetry?: () => void;
}

export default function OfflinePage({ onRetry }: OfflinePageProps) {
  return (
    <main className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <OfflineContent />
        <OfflineActions onRetry={onRetry} />
      </div>
    </main>
  );
}
