import { Suspense } from "react";

import PrivacyPolicyPage from "@/components/pages/(legal)/privacy/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { createDynamicMetadata } from "@/lib/seo/create-page-seo";

export const generateMetadata = createDynamicMetadata(async ({ locale }) => {
  const dictionary = await getDictionary(locale);
  const page = dictionary.pages.legal.privacy;

  return {
    locale,
    title: page.metadata.title,
    description: page.metadata.description,
    keywords: page.metadata.keywords,
    path: "/privacy",
  };
});

async function LocalizedPrivacyContent({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <PrivacyPolicyPage content={dictionary.pages.legal.privacy} />;
}

export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <LocalizedPrivacyContent params={params} />
    </Suspense>
  );
}
