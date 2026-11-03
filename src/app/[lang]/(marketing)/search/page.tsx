import type { Metadata } from "next";
import { Suspense } from "react";

import SearchPage from "@/components/pages/(marketing)/search/page";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { Spinner } from "@/components/ui/spinner";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocalizedPath } from "@/i18n/navigation";
import { constructMetadata, resolveOrigin } from "@/lib/metadata/construct-metadata";
import type { Locale } from "@/types/config";
import { getActiveLocales } from "@/validation/i18n-config";

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
    title: dictionary.seo.search.title,
    description: dictionary.seo.search.description,
    locale: lang,
    path: "/search",
  });
}

function SearchPageFallback() {
  return (
    <main className="min-h-[calc(100vh-16rem)] w-full px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Search</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Search across features, architecture, and legal documentation.
          </p>
        </div>
        <div className="flex items-center justify-center py-16">
          <Spinner className="text-muted-foreground size-5" />
        </div>
      </div>
    </main>
  );
}

export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent params={params} />
    </Suspense>
  );
}

async function SearchPageContent({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const siteUrl = resolveOrigin();

  const breadcrumbs = [
    { name: dictionary.navigation.home, url: `${siteUrl}${getLocalizedPath("/", lang)}` },
    { name: dictionary.seo.search.title, url: `${siteUrl}${getLocalizedPath("/search", lang)}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <SearchPage locale={lang} searchI18n={dictionary.search} />
    </>
  );
}
