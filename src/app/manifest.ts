import type { MetadataRoute } from "next";

import { siteConfig } from "@/site.config";

/**
 * Native Next.js Manifest generator using centralized site configuration.
 */
export default function manifest(): MetadataRoute.Manifest {
  const m = siteConfig.manifest;

  return {
    name: m?.name || siteConfig.name || "Web Application",
    short_name: m?.shortName || siteConfig.shortName || siteConfig.name || "App",
    description: m?.description || siteConfig.description,
    start_url: m?.startUrl || "/",
    display: m?.display || "standalone",
    theme_color: m?.themeColor,
    background_color: m?.backgroundColor,
    orientation: m?.orientation,
    icons: m?.icons ? [...m.icons] : undefined,
  };
}
