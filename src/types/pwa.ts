export type PWACachingStrategy =
  "cache-first" | "network-first" | "stale-while-revalidate" | "network-only";

export interface PWACacheConfig {
  readonly maxEntries?: number;
  readonly maxAgeSeconds?: number;
}

export interface PWARuntimeRouteConfig {
  readonly pattern: string;
  readonly strategy: PWACachingStrategy;
  readonly options?: PWACacheConfig;
}

export interface PWAConfig {
  readonly enabled: boolean;
  readonly swUrl?: string;
  readonly scope?: string;
  readonly offlineFallbackUrl?: string;
  readonly runtimeCaching?: readonly PWARuntimeRouteConfig[];
  /**
   * If true (default), intercepts beforeinstallprompt and prevents the browser's
   * default automatic mini-infobar so an in-app button can trigger it via promptInstall().
   * If false, allows the browser to show its default native install banner automatically.
   */
  readonly autoPrompt?: boolean;
}

export type PlatformType = "chromium" | "firefox" | "ios" | "other";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAContextValue {
  readonly isOnline: boolean;
  readonly isInstalled: boolean;
  readonly canInstall: boolean;
  readonly platform: PlatformType;
  readonly promptInstall: () => Promise<boolean>;
}

export interface PWAInstallButtonProps {
  readonly className?: string;
  readonly label?: string;
  readonly variant?: "default" | "outline" | "secondary" | "ghost";
  readonly size?: "default" | "sm" | "lg" | "icon";
  readonly showIconOnlyOnMobile?: boolean;
  readonly onInstalled?: () => void;
}
