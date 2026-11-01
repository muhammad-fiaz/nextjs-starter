import Link from "next/link";
import { type ReactNode } from "react";

import { GithubIcon, TwitterIcon } from "@/components/icons/social-icons";
import { getLocalizedPath } from "@/i18n/navigation";
import { siteConfig } from "@/site.config";
import type { DictionaryFooter, DictionaryNavigation } from "@/types/i18n";

interface SiteFooterProps {
  readonly currentLocale?: string;
  readonly navigation?: DictionaryNavigation;
  readonly footer?: DictionaryFooter;
}

export function SiteFooter({ currentLocale, navigation, footer }: SiteFooterProps): ReactNode {
  const currentYear = 2026;
  const getHref = (path: string) => getLocalizedPath(path, currentLocale);

  return (
    <footer className="border-border/40 bg-muted/20 w-full border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 font-bold tracking-tight">
              <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-md text-xs font-black">
                N
              </div>
              <span>{siteConfig.name}</span>
            </div>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              {siteConfig.description}
            </p>

            {}
            <div className="flex items-center gap-3 pt-2">
              {siteConfig.social?.github && (
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1.5 transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {siteConfig.social?.twitter && (
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1.5 transition-colors"
                  aria-label="Twitter / X"
                >
                  <TwitterIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-foreground text-xs font-semibold tracking-wider uppercase">
              {footer?.navigationHeading || "Navigation"}
            </h3>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              <li>
                <Link href={getHref("/")} className="hover:text-foreground">
                  {navigation?.home || "Home"}
                </Link>
              </li>
              <li>
                <Link href={getHref("/#features")} className="hover:text-foreground">
                  {navigation?.features || "Features"}
                </Link>
              </li>
              <li>
                <Link href={getHref("/#architecture")} className="hover:text-foreground">
                  {navigation?.architecture || "Architecture"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground text-xs font-semibold tracking-wider uppercase">
              {footer?.legalHeading || "Legal & Compliance"}
            </h3>
            <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
              <li>
                <Link href={getHref("/privacy")} className="hover:text-foreground">
                  {navigation?.privacy || "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href={getHref("/terms")} className="hover:text-foreground">
                  {navigation?.terms || "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link href={getHref("/cookies")} className="hover:text-foreground">
                  {navigation?.cookies || "Cookie Policy"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border/40 text-muted-foreground mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs sm:flex-row">
          <p>
            &copy; {currentYear} {siteConfig.organization?.name || siteConfig.name}.{" "}
            {footer?.copyright || "Open source under MIT License."}
          </p>
          <div className="flex items-center gap-4">
            {siteConfig.organization?.email && (
              <a
                href={`mailto:${siteConfig.organization.email}`}
                className="hover:text-foreground transition-colors"
              >
                {siteConfig.organization.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
