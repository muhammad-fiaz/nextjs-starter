"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useWebMCPTool } from "@/hooks/use-webmcp-tool";
import { ensureModelContext } from "@/lib/webmcp/registry";
import { siteConfig } from "@/site.config";

/**
 * Initializes global browser agent tools (navigation, context/site info)
 * compliant with Chrome WebMCP standards.
 * Defers router actions until the client has mounted to prevent premature Next.js router dispatches.
 */
export function WebMCPProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    ensureModelContext();
  }, []);

  // Tool 1: Navigate to page
  useWebMCPTool(
    {
      name: "navigate_to_page",
      description: "Navigate to a specific path within Next.js Starter web application.",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              "The application route or URL path (e.g. '/', '/privacy', '/terms', '/api', '/cookies')",
          },
        },
        required: ["path"],
      },
      annotations: {
        readOnlyHint: false,
        consequentialHint: false,
      },
      execute: async ({ path }: { path: string }) => {
        if (typeof window !== "undefined" && isMounted) {
          router.push(path);
          return { success: true, destination: path };
        }
        return { success: false, reason: "Router not initialized yet" };
      },
    },
    [router, isMounted],
  );

  // Tool 2: Get current page and site info
  useWebMCPTool(
    {
      name: "get_current_context",
      description: "Returns the current active page path, title, and site configuration.",
      inputSchema: {
        type: "object",
        properties: {},
      },
      annotations: {
        readOnlyHint: true,
      },
      execute: async () => {
        return {
          currentPath: pathname,
          siteName: siteConfig.name,
          siteUrl: siteConfig.url,
          defaultLocale: siteConfig.i18n?.defaultLocale ?? "en",
          supportedLocales: siteConfig.i18n?.locales ?? ["en"],
        };
      },
    },
    [pathname],
  );

  return <>{children}</>;
}
