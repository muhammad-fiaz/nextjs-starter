import type { Metadata } from "next";

import OfflinePage from "@/components/pages/(system)/offline/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { constructMetadata } from "@/lib/metadata/construct-metadata";
import { siteConfig } from "@/site.config";
import type { Locale } from "@/types/config";

export const instant = false;

export function generateStaticParams(): { lang: Locale }[] {
  return siteConfig.i18n.locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = constructMetadata({
  title: "Offline",
  description: "You are currently offline. Please check your internet connection.",
  noIndex: true,
});

export default async function OfflineRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <OfflinePage
      title={dictionary.offline.title}
      description={dictionary.offline.description}
      retryAction={dictionary.offline.retryAction}
    />
  );
}
