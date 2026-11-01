import type { Metadata } from "next";

import OfflinePage from "@/components/pages/(system)/offline/page";
import { constructMetadata } from "@/lib/metadata/construct-metadata";

export const metadata: Metadata = constructMetadata({
  title: "Offline",
  description: "You are currently offline. Please check your internet connection.",
  noIndex: true,
});

export default function OfflineRoute() {
  return <OfflinePage />;
}
