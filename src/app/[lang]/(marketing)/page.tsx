import type { Metadata } from "next";
import { Suspense } from "react";

import HomePage from "@/components/pages/(marketing)/home/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { constructMetadata } from "@/lib/metadata/construct-metadata";
import { siteConfig } from "@/site.config";

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    path: "/",
  });
}

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
