import type { MetadataRoute } from "next";

import { siteConfig } from "@/site.config";

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
    icons: m?.icons
      ? [...m.icons]
      : [
          {
            src: "/icon",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "/apple-icon",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
  };
}
