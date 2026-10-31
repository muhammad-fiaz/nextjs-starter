import { NotFoundActions } from "./sections/not-found-actions";
import { NotFoundContent } from "./sections/not-found-content";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <NotFoundContent />
        <NotFoundActions />
      </div>
    </main>
  );
}
