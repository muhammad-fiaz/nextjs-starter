import { Suspense } from "react";

import SearchPage from "@/components/pages/(marketing)/search/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { createDynamicMetadata } from "@/lib/seo/create-page-seo";

export const generateMetadata = createDynamicMetadata(async ({ locale }) => {
  const dictionary = await getDictionary(locale);

  return {
    locale,
    title: dictionary.search.title,
    description: dictionary.search.pageDescription,
    path: "/search",
  };
});

async function LocalizedSearchContent({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { lang } = await params;
  const { q } = await searchParams;
  const dictionary = await getDictionary(lang);

  return <SearchPage locale={lang} searchI18n={dictionary.search} initialQuery={q || ""} />;
}

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <LocalizedSearchContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
