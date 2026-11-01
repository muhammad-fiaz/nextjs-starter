export type ConsentDecision = "accepted" | "denied" | "custom";

export interface CookieCategoriesConsent {
  readonly necessary: boolean;
  readonly analytics: boolean;
  readonly advertising: boolean;
  readonly preferences: boolean;
}

export interface StoredConsentRecord {
  readonly decision: ConsentDecision;
  readonly categories: CookieCategoriesConsent;
  readonly policyVersion: string;
  readonly decidedAt: number;
  readonly expiresAt: number;
}

export interface CookieAttributes {
  readonly path?: string;
  readonly domain?: string;
  readonly maxAge?: number;
  readonly expires?: Date;
  readonly secure?: boolean;
  readonly sameSite?: "strict" | "lax" | "none";
}

export interface CookieConsentConfig {
  readonly enabled: boolean;
  readonly consent: {
    readonly policyVersion: string;
    readonly defaultDurationDays: number;
  };
  readonly banner: {
    readonly enabled: boolean;
    readonly cookiePolicyUrl?: string;
  };
}

export type AnalyticsStrategy = "standalone" | "gtm";

export interface GoogleTagManagerConfig {
  readonly enabled: boolean;
  readonly containerId?: string;
  readonly analyticsStrategy?: AnalyticsStrategy;
}

export interface GoogleAnalyticsConfig {
  readonly enabled: boolean;
  readonly measurementId?: string;
  readonly analyticsStrategy?: AnalyticsStrategy;
}

export interface GoogleAdSenseConfig {
  readonly enabled: boolean;
  readonly publisherId?: string;
}

export interface MicrosoftClarityConfig {
  readonly enabled: boolean;
  readonly projectId?: string;
}

export interface VercelIntegrationsConfig {
  readonly analytics?: boolean;
  readonly speedInsights?: boolean;
}

export interface SiteIntegrationsConfig {
  readonly googleTagManager?: GoogleTagManagerConfig;
  readonly googleAnalytics?: GoogleAnalyticsConfig;
  readonly googleAdsense?: GoogleAdSenseConfig;
  readonly clarity?: MicrosoftClarityConfig;
  readonly vercel?: VercelIntegrationsConfig;
}
