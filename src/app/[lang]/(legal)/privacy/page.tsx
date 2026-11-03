import type { Metadata } from "next";

import PrivacyPolicyPage from "@/components/pages/(legal)/privacy/page";
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
    title: dictionary.seo.privacy.title,
    description: dictionary.seo.privacy.description,
    locale: lang,
    path: "/privacy",
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const siteUrl = resolveOrigin();

  const breadcrumbs = [
    { name: dictionary.navigation.home, url: `${siteUrl}${getLocalizedPath("/", lang)}` },
    { name: dictionary.seo.privacy.title, url: `${siteUrl}${getLocalizedPath("/privacy", lang)}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <PrivacyPolicyPage content={dictionary.pages.legal.privacy} />
    </>
  );
}
