import { ServiceUnavailableActions } from "./sections/service-unavailable-actions";
import { ServiceUnavailableContent } from "./sections/service-unavailable-content";

export interface ServiceUnavailablePageProps {
  readonly onRetry?: () => void;
}

export default function ServiceUnavailablePage({ onRetry }: ServiceUnavailablePageProps) {
  return (
    <main className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <ServiceUnavailableContent />
        <ServiceUnavailableActions onRetry={onRetry} />
      </div>
    </main>
  );
}
