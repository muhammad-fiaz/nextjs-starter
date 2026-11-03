import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import NotFoundPage from "@/components/pages/(system)/not-found/page";
import { GlobalJsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/i18n/get-dictionary";
import { constructMetadata } from "@/lib/metadata/construct-metadata";
import { siteConfig } from "@/site.config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = siteConfig.i18n.defaultLocale;
  const dictionary = await getDictionary(locale);
  return constructMetadata({
    title: dictionary.seo.notFound.title,
    description: dictionary.seo.notFound.description,
    locale,
    noIndex: true,
  });
}

export default async function NotFound() {
  const locale = siteConfig.i18n.defaultLocale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <GlobalJsonLd locale={locale} description={dictionary.common.description} />
      <Navbar
        currentLocale={locale}
        navigation={dictionary.navigation}
        search={dictionary.search}
      />
      <main className="flex-1">
        <NotFoundPage />
      </main>
      <Footer
        currentLocale={locale}
        navigation={dictionary.navigation}
        footer={dictionary.footer}
        common={dictionary.common}
      />
    </div>
  );
}
