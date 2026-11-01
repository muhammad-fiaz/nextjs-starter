"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

import { GithubIcon } from "@/components/icons/social-icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getLocalizedPath } from "@/i18n/navigation";
import { siteConfig } from "@/site.config";
import type { MobileNavProps } from "@/types/layouts";

export function MobileNav({ currentLocale, navigation }: MobileNavProps): ReactNode {
  const [open, setOpen] = useState(false);
  const getHref = (path: string) => getLocalizedPath(path, currentLocale);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-accent/60 h-9 w-9 p-0 md:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        }
      />
      <SheetContent side="left" className="w-72 p-6 sm:w-80">
        <SheetHeader className="mb-6 space-y-2 text-left">
          <SheetTitle className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black shadow-xs">
              N
            </div>
            <span className="font-bold">{siteConfig.name}</span>
          </SheetTitle>
          <SheetDescription className="text-xs">{siteConfig.description}</SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 text-sm font-medium">
          {navigation?.home && (
            <Link
              href={getHref("/")}
              onClick={() => setOpen(false)}
              className="hover:bg-accent hover:text-foreground rounded-lg px-3 py-2.5 transition-colors"
            >
              {navigation.home}
            </Link>
          )}
          {navigation?.features && (
            <Link
              href={getHref("/#features")}
              onClick={() => setOpen(false)}
              className="hover:bg-accent hover:text-foreground rounded-lg px-3 py-2.5 transition-colors"
            >
              {navigation.features}
            </Link>
          )}
          {navigation?.architecture && (
            <Link
              href={getHref("/#architecture")}
              onClick={() => setOpen(false)}
              className="hover:bg-accent hover:text-foreground rounded-lg px-3 py-2.5 transition-colors"
            >
              {navigation.architecture}
            </Link>
          )}
          {navigation?.search && (
            <Link
              href={getHref("/search")}
              onClick={() => setOpen(false)}
              className="hover:bg-accent hover:text-foreground rounded-lg px-3 py-2.5 transition-colors"
            >
              {navigation.search}
            </Link>
          )}
        </nav>

        <div className="border-border/60 mt-6 border-t pt-6">
          <div className="flex flex-col gap-1 text-xs">
            {navigation?.privacy && (
              <Link
                href={getHref("/privacy")}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 transition-colors"
              >
                {navigation.privacy}
              </Link>
            )}
            {navigation?.terms && (
              <Link
                href={getHref("/terms")}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 transition-colors"
              >
                {navigation.terms}
              </Link>
            )}
            {navigation?.cookies && (
              <Link
                href={getHref("/cookies")}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 transition-colors"
              >
                {navigation.cookies}
              </Link>
            )}
          </div>
        </div>

        {siteConfig.social?.github && (
          <div className="border-border/60 mt-6 border-t pt-6">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={navigation?.github}
              className="block"
            >
              <Button
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90 w-full gap-2 text-xs font-semibold shadow-xs"
              >
                <GithubIcon className="h-4 w-4 shrink-0" />
                {navigation?.github && <span>{navigation.github}</span>}
              </Button>
            </a>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
