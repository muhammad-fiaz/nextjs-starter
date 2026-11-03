import type { Metadata } from "next";

import OfflinePage from "@/components/pages/(system)/offline/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { constructMetadata } from "@/lib/metadata/construct-metadata";
import type { Locale } from "@/types/config";
import { getActiveLocales } from "@/validation/i18n-config";

export const instant = false;

export function generateStaticParams(): { lang: Locale }[] {
  return getActiveLocales().map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return constructMetadata({
    title: dictionary.seo.offline.title,
    description: dictionary.seo.offline.description,
    locale: lang,
    noIndex: true,
  });
}

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
