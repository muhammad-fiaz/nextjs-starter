import type { Metadata } from "next";
import { Suspense } from "react";

import TermsOfServicePage from "@/components/pages/(legal)/terms/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { constructMetadata } from "@/lib/metadata/construct-metadata";

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: "Terms of Service",
    description: "Read the terms and conditions governing the use of our website and services.",
    path: "/terms",
  });
}

async function LocalizedTermsContent({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <TermsOfServicePage content={dictionary.pages.legal.terms} />;
}

export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <LocalizedTermsContent params={params} />
    </Suspense>
  );
}
