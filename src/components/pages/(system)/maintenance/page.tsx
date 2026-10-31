import { MaintenanceActions } from "./sections/maintenance-actions";
import { MaintenanceContent } from "./sections/maintenance-content";

export interface MaintenancePageProps {
  readonly onCheckStatus?: () => void;
}

export default function MaintenancePage({ onCheckStatus }: MaintenancePageProps) {
  return (
    <main className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <MaintenanceContent />
        <MaintenanceActions onCheckStatus={onCheckStatus} />
      </div>
    </main>
  );
}
