import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocaleDirection, isSupportedLocale } from "@/i18n/validation";
import { siteConfig } from "@/site.config";
import type { Locale } from "@/types/config";

export const instant = false;

export function generateStaticParams(): { lang: Locale }[] {
  return siteConfig.i18n.locales.map((lang) => ({ lang }));
}

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ lang: string }>;
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
      <SiteHeader
        currentLocale={currentLang}
        navigation={dictionary.navigation}
        search={dictionary.search}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        currentLocale={currentLang}
        navigation={dictionary.navigation}
        footer={dictionary.footer}
      />
    </div>
  );
}
