import { Suspense } from "react";

import HomePage from "@/components/pages/(marketing)/home/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { createDynamicMetadata } from "@/lib/seo/create-page-seo";

export const generateMetadata = createDynamicMetadata(async ({ locale }) => {
  const dictionary = await getDictionary(locale);
  return {
    locale,
    title: dictionary.common.appName,
    description: dictionary.home.hero.description,
    path: "/",
  };
});

async function LocalizedHomeContent({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <HomePage currentLocale={lang} dictionary={dictionary} />;
}

export default function LocalizedHome({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={<HomePage />}>
      <LocalizedHomeContent params={params} />
    </Suspense>
  );
}
