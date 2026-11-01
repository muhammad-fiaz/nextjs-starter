import type { Metadata } from "next";

import HomePage from "@/components/pages/(marketing)/home/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { constructMetadata } from "@/lib/metadata/construct-metadata";
import { siteConfig } from "@/site.config";
import type { Locale } from "@/types/config";

export const instant = false;

export function generateStaticParams(): { lang: Locale }[] {
  return siteConfig.i18n.locales.map((lang) => ({ lang }));
}

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: siteConfig.name,
    description: siteConfig.description,
    path: "/",
  });
}

export default async function LocalizedHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <HomePage currentLocale={lang} dictionary={dictionary} />;
}
