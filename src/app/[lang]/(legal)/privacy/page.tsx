import type { Metadata } from "next";
import { Suspense } from "react";

import PrivacyPolicyPage from "@/components/pages/(legal)/privacy/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { constructMetadata } from "@/lib/metadata/construct-metadata";

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: "Privacy Policy",
    description: "Learn how we collect, use, and protect your personal information.",
    path: "/privacy",
  });
}

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
