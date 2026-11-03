"use client";

import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { CookiePreferencesDialogProps } from "@/types/cookies";

const OPTIONAL_CATEGORIES = [
  {
    key: "analytics",
    label: "Analytics",
    description: "Helps us understand how the site is used so we can improve it.",
  },
  {
    key: "advertising",
    label: "Advertising",
    description: "Allows personalised advertising and campaign measurement.",
  },
  {
    key: "preferences",
    label: "Preferences",
    description: "Remembers choices such as language, theme, and layout.",
  },
] as const;

type OptionalCategoryKey = (typeof OPTIONAL_CATEGORIES)[number]["key"];

export function CookiePreferencesDialog({
  open,
  onOpenChange,
  categories,
  onSave,
}: CookiePreferencesDialogProps): ReactNode {
  const [customCategories, setCustomCategories] = useState<Record<OptionalCategoryKey, boolean>>({
    analytics: false,
    advertising: false,
    preferences: false,
  });

  useEffect(() => {
    if (!open) return;
    setCustomCategories({
      analytics: categories?.analytics ?? false,
      advertising: categories?.advertising ?? false,
      preferences: categories?.preferences ?? false,
    });
  }, [open, categories]);

  const toggleCategory = (key: OptionalCategoryKey) => {
    setCustomCategories((current) => ({ ...current, [key]: !current[key] }));
  };

  const savePreferences = () => {
    onSave(customCategories);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cookie preferences</DialogTitle>
          <DialogDescription>
            Choose which optional cookies you allow. Necessary cookies are always enabled.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="cookie-necessary">Necessary</Label>
              <p className="text-muted-foreground text-xs">
                Required for security, authentication, and core functionality.
              </p>
            </div>
            <Switch id="cookie-necessary" checked disabled aria-readonly />
          </div>

          {OPTIONAL_CATEGORIES.map((category) => (
            <div key={category.key} className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor={`cookie-${category.key}`}>{category.label}</Label>
                <p className="text-muted-foreground text-xs">{category.description}</p>
              </div>
              <Switch
                id={`cookie-${category.key}`}
                checked={customCategories[category.key]}
                onCheckedChange={() => toggleCategory(category.key)}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={savePreferences}>Save preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
