import type { Metadata } from "next";

import { CookieConsentProvider } from "@/components/cookies/cookie-consent-provider";
import { IntegrationManager } from "@/components/integrations/integration-manager";
import { VercelInsights } from "@/components/integrations/vercel/vercel-insights";
import { TanStackProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { WebMCPProvider } from "@/components/providers/webmcp-provider";
import { PWAProvider } from "@/components/pwa/pwa-provider";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontVariables} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="ard" href="/.well-known/ard.json" />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <TanStackProvider>
            <PWAProvider>
              <WebMCPProvider>
                <CookieConsentProvider>
                  <IntegrationManager />
                  {children}
                </CookieConsentProvider>
              </WebMCPProvider>
              <VercelInsights />
            </PWAProvider>
          </TanStackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
