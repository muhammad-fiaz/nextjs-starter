"use client";

import { Download, HelpCircle, MoreVertical, Plus, Share2, Smartphone } from "lucide-react";
import { type ReactNode, useState } from "react";

import { usePWA } from "@/components/pwa/pwa-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PWAInstallButtonProps } from "@/types/pwa";

export function PWAInstallButton({
  className,
  label = "Install App",
  variant = "outline",
  size = "sm",
  showIconOnlyOnMobile = true,
  onInstalled,
}: PWAInstallButtonProps): ReactNode {
  const { canInstall, isInstalled, platform, promptInstall } = usePWA();
  const [showInstructions, setShowInstructions] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (!canInstall && platform === "chromium") {
    return null;
  }

  const handleInstallClick = async () => {
    if (canInstall) {
      const accepted = await promptInstall();
      if (accepted && onInstalled) {
        onInstalled();
      }
      return;
    }

    setShowInstructions(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleInstallClick}
        className={className}
        aria-label={label}
        title={label}
      >
        <Download className="h-3.5 w-3.5 sm:mr-1.5" aria-hidden="true" />
        {showIconOnlyOnMobile ? (
          <span className="hidden sm:inline">{label}</span>
        ) : (
          <span>{label}</span>
        )}
      </Button>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="text-primary h-5 w-5" />
              Install Application
            </DialogTitle>
            <DialogDescription>
              Follow these simple steps to install this web app on your device for fast access and
              offline capability.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {platform === "firefox" && (
              <div className="bg-muted/50 space-y-3 rounded-lg p-4 text-sm">
                <div className="text-foreground flex items-center gap-2 font-medium">
                  <Smartphone className="text-primary h-4 w-4" />
                  <span>Firefox Installation</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Mozilla Firefox handles progressive web apps via its browser menu:
                </p>
                <ol className="text-muted-foreground list-decimal space-y-1.5 pl-5">
                  <li>
                    Tap or click the{" "}
                    <strong>
                      three dots menu{" "}
                      <MoreVertical className="inline h-3.5 w-3.5" aria-hidden="true" />
                    </strong>{" "}
                    in Firefox.
                  </li>
                  <li>
                    Select <strong>&quot;Install&quot;</strong> or{" "}
                    <strong>&quot;Add to Home screen&quot;</strong>.
                  </li>
                  <li>Confirm to add the app icon to your home screen or desktop.</li>
                </ol>
              </div>
            )}

            {platform === "ios" && (
              <div className="bg-muted/50 space-y-3 rounded-lg p-4 text-sm">
                <div className="text-foreground flex items-center gap-2 font-medium">
                  <Share2 className="text-primary h-4 w-4" />
                  <span>Safari / iOS Installation</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  On Apple iOS devices, web applications are installed via the Safari Share menu:
                </p>
                <ol className="text-muted-foreground list-decimal space-y-1.5 pl-5">
                  <li>
                    Tap the <strong>Share button</strong> (square with arrow) in Safari’s toolbar.
                  </li>
                  <li>
                    Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>{" "}
                    <Plus className="inline h-3.5 w-3.5" aria-hidden="true" />.
                  </li>
                  <li>
                    Tap <strong>&quot;Add&quot;</strong> in the top-right corner to complete.
                  </li>
                </ol>
              </div>
            )}

            {platform === "other" && (
              <div className="bg-muted/50 space-y-3 rounded-lg p-4 text-sm">
                <div className="text-foreground flex items-center gap-2 font-medium">
                  <HelpCircle className="text-primary h-4 w-4" />
                  <span>Browser Instructions</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Open your browser’s main options or share menu and look for{" "}
                  <strong>&quot;Install App&quot;</strong> or{" "}
                  <strong>&quot;Add to Home Screen&quot;</strong>.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
