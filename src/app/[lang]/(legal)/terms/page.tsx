import type { Metadata } from "next";

import TermsOfServicePage from "@/components/pages/(legal)/terms/page";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocalizedPath } from "@/i18n/navigation";
import { constructMetadata, resolveOrigin } from "@/lib/metadata/construct-metadata";
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
    title: dictionary.seo.terms.title,
    description: dictionary.seo.terms.description,
    locale: lang,
    path: "/terms",
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const siteUrl = resolveOrigin();

  const breadcrumbs = [
    { name: dictionary.navigation.home, url: `${siteUrl}${getLocalizedPath("/", lang)}` },
    { name: dictionary.seo.terms.title, url: `${siteUrl}${getLocalizedPath("/terms", lang)}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <TermsOfServicePage content={dictionary.pages.legal.terms} />
    </>
  );
}
