import type { Metadata } from "next";
import { Suspense } from "react";

import SearchPage from "@/components/pages/(marketing)/search/page";
import { Spinner } from "@/components/ui/spinner";
import { getDictionary } from "@/i18n/get-dictionary";
import { constructMetadata } from "@/lib/metadata/construct-metadata";
import { siteConfig } from "@/site.config";
import type { Locale } from "@/types/config";

export function generateStaticParams(): { lang: Locale }[] {
  return siteConfig.i18n.locales.map((lang) => ({ lang }));
}

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: "Search",
    description: "Search across features, architecture, and legal documentation.",
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

  return <SearchPage locale={lang} searchI18n={dictionary.search} />;
}
