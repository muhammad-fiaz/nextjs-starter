import { ForbiddenActions } from "./sections/forbidden-actions";
import { ForbiddenContent } from "./sections/forbidden-content";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <ForbiddenContent />
        <ForbiddenActions />
      </div>
    </main>
  );
}
