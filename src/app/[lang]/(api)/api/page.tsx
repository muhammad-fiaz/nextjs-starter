import { Suspense } from "react";

import ApiPage from "@/components/pages/(api)/api/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { createDynamicMetadata } from "@/lib/seo/create-page-seo";

export const generateMetadata = createDynamicMetadata(async ({ locale }) => {
  const dictionary = await getDictionary(locale);
  const page = dictionary.pages.api;

  return {
    locale,
    title: page.metadata.title,
    description: page.metadata.description,
    keywords: page.metadata.keywords,
    noIndex: true,
    sitemap: false,
  };
});

async function LocalizedApiContent({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <ApiPage locale={lang} content={dictionary.pages.api} />;
}

export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <LocalizedApiContent params={params} />
    </Suspense>
  );
}
