import Link from "next/link";
import { type ReactNode } from "react";

import { GithubIcon } from "@/components/icons/social-icons";
import { MobileNav } from "@/components/layout/mobile-nav";
import { GlobalSearchDialog } from "@/components/search/global-search-dialog";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getLocalizedPath } from "@/i18n/navigation";
import { siteConfig } from "@/site.config";
import type { NavbarProps } from "@/types/layouts";

export function Navbar({ currentLocale, navigation, search }: NavbarProps): ReactNode {
  const getHref = (path: string) => getLocalizedPath(path, currentLocale);

  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 md:gap-8">
          <Link
            href={getHref("/")}
            className="group flex items-center gap-2.5 font-bold tracking-tight transition-opacity hover:opacity-90"
          >
            <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black shadow-sm transition-transform group-hover:scale-105">
              N
            </div>
            <span className="text-base font-semibold tracking-tight sm:text-lg">
              {siteConfig.name}
            </span>
          </Link>

          <nav className="text-muted-foreground hidden items-center gap-6 text-sm font-medium md:flex">
            {navigation?.features && (
              <Link
                href={getHref("/#features")}
                className="hover:text-foreground transition-colors"
              >
                {navigation.features}
              </Link>
            )}
            {navigation?.architecture && (
              <Link
                href={getHref("/#architecture")}
                className="hover:text-foreground transition-colors"
              >
                {navigation.architecture}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <GlobalSearchDialog currentLocale={currentLocale} searchI18n={search} />

          <div className="bg-border/60 mx-1 hidden h-4 w-px sm:block" />

          <LanguageToggle currentLocale={currentLocale} />
          <ThemeToggle />

          {siteConfig.social?.github && (
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={navigation?.github}
              className="hidden sm:inline-flex"
            >
              <Button
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90 gap-2 text-xs font-semibold shadow-xs transition-colors"
              >
                <GithubIcon className="h-4 w-4 shrink-0" />
                {navigation?.github && <span>{navigation.github}</span>}
              </Button>
            </a>
          )}

          <MobileNav currentLocale={currentLocale} navigation={navigation} />
        </div>
      </div>
    </header>
  );
}
