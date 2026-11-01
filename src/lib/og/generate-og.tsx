import { ImageResponse } from "next/og";

import { siteConfig } from "@/site.config";
import type { OgImageProps } from "@/types/seo";

export const defaultOgDimensions = {
  width: 1200,
  height: 630,
};

export const defaultOgContentType = "image/png";

export function createDynamicOgImage(props?: Partial<OgImageProps>): ImageResponse {
  const brandName = props?.siteName || siteConfig.name || "Next.js Starter";
  const title = props?.title || brandName;
  const description =
    props?.description ||
    siteConfig.description ||
    "Production-Ready Architecture & Application Foundation";
  const category = props?.category;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#09090b",
        color: "#fafafa",
        padding: "80px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000000",
            fontWeight: 900,
            fontSize: "24px",
          }}
        >
          N
        </div>
        <span style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em" }}>
          {brandName}
        </span>
        {category && (
          <span
            style={{
              marginLeft: "12px",
              padding: "4px 12px",
              borderRadius: "6px",
              backgroundColor: "#27272a",
              color: "#a1a1aa",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {category}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "24px",
            lineHeight: 1.4,
            color: "#a1a1aa",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "16px",
          color: "#71717a",
          fontWeight: 500,
        }}
      >
        <span>React 19 &bull; Next.js 16 &bull; TypeScript &bull; Tailwind CSS v4</span>
      </div>
    </div>,
    {
      ...defaultOgDimensions,
    },
  );
}
