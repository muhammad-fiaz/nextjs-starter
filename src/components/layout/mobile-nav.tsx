"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

import { GithubIcon } from "@/components/icons/social-icons";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getLocalizedPath } from "@/i18n/navigation";
import { siteConfig } from "@/site.config";
import type { MobileNavProps } from "@/types/layouts";

export function MobileNav({ currentLocale, navigation }: MobileNavProps): ReactNode {
  const [open, setOpen] = useState(false);
  const getHref = (path: string) => getLocalizedPath(path, currentLocale);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="md:hidden">
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-accent/60 h-9 w-9 p-0"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        }
      />

      <CollapsibleContent className="border-border/60 bg-background/95 dark:bg-card/95 dark:border-border/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 absolute top-16 right-0 left-0 border-b shadow-xl backdrop-blur-2xl transition-colors">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 sm:px-6">
          <nav className="flex flex-col gap-1.5 text-sm font-medium">
            {navigation?.features && (
              <Link
                href={getHref("/#features")}
                onClick={() => setOpen(false)}
                className="hover:bg-accent hover:text-foreground active:bg-accent/80 rounded-lg px-3 py-2.5 transition-colors"
              >
                {navigation.features}
              </Link>
            )}
            {navigation?.architecture && (
              <Link
                href={getHref("/#architecture")}
                onClick={() => setOpen(false)}
                className="hover:bg-accent hover:text-foreground active:bg-accent/80 rounded-lg px-3 py-2.5 transition-colors"
              >
                {navigation.architecture}
              </Link>
            )}
          </nav>

          <div className="border-border/60 dark:border-border/40 flex flex-col gap-2.5 border-t pt-3">
            {siteConfig.social?.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={navigation?.github}
                className="block"
                onClick={() => setOpen(false)}
              >
                <Button
                  size="sm"
                  className="bg-foreground text-background hover:bg-foreground/90 w-full gap-2 text-xs font-semibold shadow-xs"
                >
                  <GithubIcon className="h-4 w-4 shrink-0" />
                  {navigation?.github && <span>{navigation.github}</span>}
                </Button>
              </a>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
