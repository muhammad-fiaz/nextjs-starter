import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import HomePage from "@/components/pages/(marketing)/home/page";
import { getDictionary } from "@/i18n/get-dictionary";
import { createPageMetadata } from "@/lib/seo/create-page-seo";

export const metadata = createPageMetadata({
  title: "Next.js Starter",
  description:
    "Production-ready, infrastructure-first open source Next.js starter template featuring React 19, TypeScript, and Tailwind CSS v4.",
  path: "/",
});

export default async function RootPage() {
  const dictionary = await getDictionary("en");
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Navbar currentLocale="en" navigation={dictionary.navigation} search={dictionary.search} />
      <main className="flex-1">
        <HomePage currentLocale="en" dictionary={dictionary} />
      </main>
      <Footer currentLocale="en" navigation={dictionary.navigation} footer={dictionary.footer} />
    </div>
  );
}
