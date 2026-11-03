"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { env } from "@/env";
import { siteConfig } from "@/site.config";
import type { BeforeInstallPromptEvent, PlatformType, PWAContextValue } from "@/types/pwa";

const PWAContext = createContext<PWAContextValue>({
  isOnline: true,
  isInstalled: false,
  canInstall: false,
  platform: "other",
  promptInstall: async () => false,
});

export function usePWA(): PWAContextValue {
  return useContext(PWAContext);
}

export function PWAProvider({ children }: { readonly children: ReactNode }): ReactNode {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<PlatformType>("other");

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const ua = navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isFirefoxBrowser = /firefox|fxios/.test(ua);

    if (isIOSDevice) {
      setPlatform("ios");
    } else if (isFirefoxBrowser) {
      setPlatform("firefox");
    } else {
      setPlatform("chromium");
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (
      siteConfig.pwa?.enabled &&
      env.NEXT_PUBLIC_NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      const swUrl = siteConfig.pwa.swUrl || "/sw.js";
      const scope = siteConfig.pwa.scope || "/";
      navigator.serviceWorker.register(swUrl, { scope }).catch(() => {});
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      if (siteConfig.pwa?.autoPrompt !== false) {
        e.preventDefault();
      }
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!installPrompt) return false;
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstallPrompt(null);
        return true;
      }
    } catch {}
    return false;
  };

  return (
    <PWAContext.Provider
      value={{
        isOnline,
        isInstalled,
        canInstall: Boolean(installPrompt),
        platform,
        promptInstall,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}
