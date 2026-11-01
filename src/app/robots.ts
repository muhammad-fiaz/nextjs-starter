import type { MetadataRoute } from "next";

import { env } from "@/env";
import { siteConfig } from "@/site.config";

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
