import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteConfig } from "@/site.config";
import type { Locale } from "@/types/config";
import type { LocaleLayoutProps } from "@/types/layouts";
import { getActiveLocales, getLocaleDirection, isSupportedLocale } from "@/validation/i18n-config";

export const instant = false;
export const ensureStatic = "navigation";

export function generateStaticParams(): { lang: Locale }[] {
  return getActiveLocales().map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps): Promise<ReactNode> {
  const { lang } = await params;
  const currentLang = isSupportedLocale(lang) ? lang : siteConfig.i18n.defaultLocale;
  const dir = getLocaleDirection(currentLang);
  const dictionary = await getDictionary(currentLang);

  return (
    <div
      data-locale={currentLang}
      dir={dir}
      className="bg-background text-foreground flex min-h-screen flex-col"
    >
      <Navbar
        currentLocale={currentLang}
        navigation={dictionary.navigation}
        search={dictionary.search}
      />
      <main className="flex-1">{children}</main>
      <Footer
        currentLocale={currentLang}
        navigation={dictionary.navigation}
        footer={dictionary.footer}
      />
    </div>
  );
}
