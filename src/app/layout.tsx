import type { Metadata } from "next";
import { type ReactNode, Suspense } from "react";

import { CookieConsentManager } from "@/components/cookies/cookie-consent-manager";
import { IntegrationManager } from "@/components/integrations/integration-manager";
import { TanStackProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { WebMCPProvider } from "@/components/providers/webmcp-provider";
import { PWAProvider } from "@/components/pwa/pwa-provider";
import { GlobalJsonLd } from "@/components/seo/json-ld";
import { InlineScript } from "@/components/ui/inline-script";
import { TopLoader } from "@/components/ui/top-loader";
import { fontVariables } from "@/lib/fonts";
import { constructMetadata } from "@/lib/metadata/construct-metadata";
import "./globals.css";

export const metadata: Metadata = constructMetadata();

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('app-theme');
    var isDark = stored === 'dark' || (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontVariables} h-full antialiased`}>
      <head>
        <link rel="ard" href="/.well-known/ard.json" />
        <InlineScript html={themeInitScript} />
      </head>
      <body className="flex min-h-full flex-col">
        <GlobalJsonLd />
        <ThemeProvider>
          <Suspense fallback={null}>
            <TopLoader />
          </Suspense>
          <TanStackProvider>
            <PWAProvider>
              <WebMCPProvider>
                <IntegrationManager />
                {children}
                <CookieConsentManager />
              </WebMCPProvider>
            </PWAProvider>
          </TanStackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
