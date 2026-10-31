import OfflinePage from "@/components/pages/(system)/offline/page";
import { createDynamicMetadata } from "@/lib/seo/create-page-seo";

export const generateMetadata = createDynamicMetadata(async ({ locale }) => ({
  locale,
  title: "Offline",
  description: "You are currently offline. Please check your internet connection.",
  noIndex: true,
  sitemap: false,
}));

export default function OfflineRoute() {
  return <OfflinePage />;
}
