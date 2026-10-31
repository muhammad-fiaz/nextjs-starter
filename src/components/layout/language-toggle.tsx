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
import { i18nConfig, type Locale } from "@/i18n/config";
import { getCurrentLocale, switchLocalePath } from "@/i18n/navigation";

interface LanguageToggleProps {
  readonly currentLocale?: Locale;
  readonly className?: string;
}

export function LanguageToggle({ currentLocale, className }: LanguageToggleProps): ReactNode {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // If i18n is disabled or only 1 locale configured, do not render switcher
  if (!i18nConfig.enabled || i18nConfig.locales.length <= 1) {
    return null;
  }

  // Detect active locale accurately
  const activeLocale = currentLocale || getCurrentLocale(pathname);

  const switchLocale = (newLocale: string) => {
    if (newLocale === activeLocale) return;

    // Use authoritative switchLocalePath which validates route availability
    const targetPath = switchLocalePath(pathname, newLocale);

    startTransition(() => {
      router.push(targetPath);
      router.refresh();
    });
  };

  const currentLabel = i18nConfig.localeLabels?.[activeLocale] || activeLocale.toUpperCase();

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
        {i18nConfig.locales.map((loc) => {
          const label = i18nConfig.localeLabels?.[loc] || loc.toUpperCase();
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
