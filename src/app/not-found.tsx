import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import NotFoundPage from "@/components/pages/(system)/not-found/page";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function NotFound() {
  const dictionary = await getDictionary("en");

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader
        currentLocale="en"
        navigation={dictionary.navigation}
        search={dictionary.search}
      />
      <main className="flex-1">
        <NotFoundPage />
      </main>
      <SiteFooter
        currentLocale="en"
        navigation={dictionary.navigation}
        footer={dictionary.footer}
      />
    </div>
  );
}
