"use client";

import { type ReactNode, useState } from "react";

import { CookiePreferencesDialog } from "@/components/cookies/cookie-preferences-dialog";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/site.config";
import { useConsentStore } from "@/stores/consent-store";
import type { CookiePreferencesButtonProps } from "@/types/cookies";

export function CookiePreferencesButton({ label }: CookiePreferencesButtonProps): ReactNode {
  const [isOpen, setOpen] = useState(false);
  const categories = useConsentStore((state) => state.record?.categories);
  const setCategoryConsent = useConsentStore((state) => state.setCategoryConsent);

  if (!siteConfig.cookies?.enabled) return null;

  return (
    <>
      <Button
        type="button"
        variant="link"
        size="xs"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs underline-offset-4"
      >
        {label}
      </Button>
      <CookiePreferencesDialog
        open={isOpen}
        onOpenChange={setOpen}
        categories={categories}
        onSave={setCategoryConsent}
      />
    </>
  );
}
