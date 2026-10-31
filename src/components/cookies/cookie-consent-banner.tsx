"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface CookieConsentBannerProps {
  readonly onAccept: () => void;
  readonly onDeny: () => void;
  readonly cookiePolicyUrl?: string;
}

export function CookieConsentBanner({
  onAccept,
  onDeny,
  cookiePolicyUrl = "/cookies",
}: CookieConsentBannerProps): ReactNode {
  return (
    <aside
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="border-border bg-background/95 supports-backdrop-filter:bg-background/85 fixed inset-x-4 bottom-4 z-50 mx-auto max-w-5xl rounded-xl border p-4 shadow-2xl backdrop-blur sm:px-6 sm:py-3.5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5 sm:max-w-3xl">
          <h2 className="text-foreground text-sm font-semibold tracking-tight">
            Privacy and Cookie Choices
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            We use strictly necessary cookies to keep our site secure and functional. With your
            consent, we also use optional analytics and performance cookies. Review our{" "}
            <Link
              href={cookiePolicyUrl}
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
            >
              Cookie Policy
            </Link>{" "}
            for details.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onDeny}>
            Deny
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
    </aside>
  );
}
