import { Suspense } from "react";

import TermsOfServicePage from "@/components/pages/(legal)/terms/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { createDynamicMetadata } from "@/lib/seo/create-page-seo";

export const generateMetadata = createDynamicMetadata(async ({ locale }) => {
  const dictionary = await getDictionary(locale);
  const page = dictionary.pages.legal.terms;

  return {
    locale,
    title: page.metadata.title,
    description: page.metadata.description,
    keywords: page.metadata.keywords,
    path: "/terms",
  };
});

async function LocalizedTermsContent({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <TermsOfServicePage content={dictionary.pages.legal.terms} />;
}

export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <LocalizedTermsContent params={params} />
    </Suspense>
  );
}
