import type { Metadata } from "next";
import { Suspense } from "react";

import CookiePolicyPage from "@/components/pages/(legal)/cookies/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { constructMetadata } from "@/lib/metadata/construct-metadata";

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: "Cookie Policy",
    description: "Learn how we use cookies and tracking technologies on our website.",
    path: "/cookies",
  });
}

async function LocalizedCookieContent({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <CookiePolicyPage content={dictionary.pages.legal.cookies} />;
}

export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <LocalizedCookieContent params={params} />
    </Suspense>
  );
}
