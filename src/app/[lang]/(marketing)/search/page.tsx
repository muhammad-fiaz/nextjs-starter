import type { Metadata } from "next";

import SearchPage from "@/components/pages/(marketing)/search/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { constructMetadata } from "@/lib/metadata/construct-metadata";

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: "Search",
    description: "Search across features, architecture, and legal documentation.",
    path: "/search",
  });
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { lang } = await params;
  const { q } = await searchParams;
  const dictionary = await getDictionary(lang);

  return <SearchPage locale={lang} searchI18n={dictionary.search} initialQuery={q || ""} />;
}
