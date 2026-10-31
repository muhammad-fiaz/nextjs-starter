import type { MetadataRoute } from "next";

import { env } from "@/env";
import { siteConfig } from "@/site.config";

/**
 * Environment-aware robots.txt configuration.
 * - Non-production: Disallows entire site indexing.
 * - Production: Permits crawling of public content while disallowing internal API,
 *   offline fallbacks, private, admin, and system telemetry endpoints.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = siteConfig.url?.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/private/",
        "/admin/",
        "/offline",
        "/_next/",
        "/_vercel/",
        "/auth/",
        "/checkout/",
        "/dashboard/",
      ],
    },
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined,
  };
}
