import type { Metadata } from "next";

import PrivacyPolicyPage from "@/components/pages/(legal)/privacy/page";
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
    title: "Privacy Policy",
    description: "Learn how we collect, use, and protect your personal information.",
    path: "/privacy",
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <PrivacyPolicyPage content={dictionary.pages.legal.privacy} />;
}
