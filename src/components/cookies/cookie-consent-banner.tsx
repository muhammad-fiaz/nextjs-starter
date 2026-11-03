"use client";

import { Cookie, Settings2 } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

import { CookiePreferencesDialog } from "@/components/cookies/cookie-preferences-dialog";
import { Button } from "@/components/ui/button";
import type { CookieConsentBannerProps } from "@/types/cookies";

export function CookieConsentBanner({
  onAccept,
  onDeny,
  onSavePreferences,
  cookiePolicyUrl = "/cookies",
}: CookieConsentBannerProps): ReactNode {
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <div
        role="region"
        aria-label="Cookie preferences"
        className="border-border bg-background/95 supports-backdrop-filter:bg-background/85 fixed inset-x-4 bottom-4 z-50 mx-auto max-w-5xl rounded-xl border p-4 shadow-2xl backdrop-blur sm:px-6 sm:py-3.5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 sm:max-w-3xl">
            <h2 className="text-foreground flex items-center gap-2 text-sm font-semibold tracking-tight">
              <Cookie className="h-4 w-4" aria-hidden="true" />
              Privacy and Cookie Choices
            </h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              We use strictly necessary cookies to keep our site secure and functional. With your
              consent, we also use optional analytics, advertising, and preference cookies. Review
              our{" "}
              <Link
                href={cookiePolicyUrl}
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
              >
                Cookie Policy
              </Link>{" "}
              for details.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 self-end sm:self-center">
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onDeny}>
              Deny
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings2 className="h-3.5 w-3.5" />
              Customize
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={onAccept}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>

      <CookiePreferencesDialog
        open={isSettingsOpen}
        onOpenChange={setSettingsOpen}
        onSave={onSavePreferences}
      />
    </>
  );
}
