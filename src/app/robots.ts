import type { MetadataRoute } from "next";

import { env } from "@/env";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.NEXT_PUBLIC_APP_URL || siteConfig.url || "http://localhost:3000";
  const normalized = siteUrl.replace(/\/$/, "");

  return {
    rules: [
      {
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
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/", "/offline"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/", "/offline"],
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/", "/offline"],
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
      },
    ],
    sitemap: normalized ? `${normalized}/sitemap.xml` : undefined,
  };
}
