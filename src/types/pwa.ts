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
