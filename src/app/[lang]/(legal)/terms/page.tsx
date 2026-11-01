import type { Metadata } from "next";

import TermsOfServicePage from "@/components/pages/(legal)/terms/page";
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
    title: "Terms of Service",
    description: "Read the terms and conditions governing the use of our website and services.",
    path: "/terms",
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <TermsOfServicePage content={dictionary.pages.legal.terms} />;
}
