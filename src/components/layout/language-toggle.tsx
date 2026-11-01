"use client";

import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentLocale, switchLocalePath } from "@/i18n/navigation";
import { siteConfig } from "@/site.config";
import type { Locale } from "@/types/config";

interface LanguageToggleProps {
  readonly currentLocale?: Locale;
  readonly className?: string;
}

export function LanguageToggle({ currentLocale, className }: LanguageToggleProps): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  if (!siteConfig.i18n.enabled || siteConfig.i18n.locales.length <= 1) {
    return null;
  }

  const activeLocale = currentLocale || getCurrentLocale(pathname);

  const switchLocale = (newLocale: string) => {
    if (newLocale === activeLocale) return;

    const targetPath = switchLocalePath(pathname, newLocale);

    startTransition(() => {
      router.push(targetPath);
      router.refresh();
    });
  };

  const currentLabel = siteConfig.i18n.localeLabels?.[activeLocale] || activeLocale.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`hover:bg-muted inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 text-xs font-medium transition-colors outline-none ${
          className || ""
        }`}
        disabled={isPending}
        aria-label="Select language"
      >
        <Globe className="h-4 w-4 shrink-0 opacity-80" />
        <span>{currentLabel}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {siteConfig.i18n.locales.map((loc) => {
          const label = siteConfig.i18n.localeLabels?.[loc] || loc.toUpperCase();
          const isSelected = loc === activeLocale;

          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`cursor-pointer justify-between text-xs ${
                isSelected ? "text-primary font-semibold" : ""
              }`}
            >
              <span>{label}</span>
              {isSelected && <span className="text-[10px] uppercase opacity-60">Active</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
