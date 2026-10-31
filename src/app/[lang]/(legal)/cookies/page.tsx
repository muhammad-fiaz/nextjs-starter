import { Suspense } from "react";

import CookiePolicyPage from "@/components/pages/(legal)/cookies/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { createDynamicMetadata } from "@/lib/seo/create-page-seo";

export const generateMetadata = createDynamicMetadata(async ({ locale }) => {
  const dictionary = await getDictionary(locale);
  const page = dictionary.pages.legal.cookies;

  return {
    locale,
    title: page.metadata.title,
    description: page.metadata.description,
    keywords: page.metadata.keywords,
    path: "/cookies",
  };
});

async function LocalizedCookieContent({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <CookiePolicyPage content={dictionary.pages.legal.cookies} />;
}

export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <LocalizedCookieContent params={params} />
    </Suspense>
  );
}
