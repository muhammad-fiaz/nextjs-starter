import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getLocaleDirection, i18nConfig, isSupportedLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export const instant = false;

export function generateStaticParams(): { lang: Locale }[] {
  return i18nConfig.locales.map((lang) => ({ lang }));
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
  const currentLang = isSupportedLocale(lang) ? lang : i18nConfig.defaultLocale;
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
