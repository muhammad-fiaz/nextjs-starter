import type { Metadata } from "next";

import CookiePolicyPage from "@/components/pages/(legal)/cookies/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { constructMetadata } from "@/lib/metadata/construct-metadata";
import { siteConfig } from "@/site.config";
import type { Locale } from "@/types/config";
import { getActiveLocales } from "@/validation/i18n-config";

export const instant = false;

export function generateStaticParams(): { lang: Locale }[] {
  return getActiveLocales().map((lang) => ({ lang }));
}

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: "Cookie Policy",
    description: "Learn how we use cookies and tracking technologies on our website.",
    path: "/cookies",
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <CookiePolicyPage content={dictionary.pages.legal.cookies} />;
}
