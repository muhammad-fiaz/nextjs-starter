import type { Metadata } from "next";

import type { ThingSchema } from "@/types/schema";

export type Locale = string;

export interface PageMetadataInput {
  readonly origin?: string;
  readonly locale?: Locale;
  readonly title?: string;
  readonly description?: string;
  readonly path?: string;
  readonly noIndex?: boolean;
  readonly keywords?: readonly string[];
  readonly ogType?: "website" | "article" | "profile";
  readonly openGraph?: Metadata["openGraph"];
  readonly twitter?: Metadata["twitter"];
  readonly robots?: Metadata["robots"];
  readonly ogImage?:
    | string
    | {
        readonly url: string;
        readonly width?: number;
        readonly height?: number;
        readonly alt?: string;
      };
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
  readonly authors?: readonly string[];
}

export interface SitemapEntry {
  readonly url: string;
  readonly lastModified?: string | Date;
  readonly changeFrequency?:
    "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  readonly priority?: number;
}

export interface OgImageProps {
  readonly title: string;
  readonly description?: string;
  readonly siteName?: string;
}

export interface JsonLdProps {
  readonly data: ThingSchema | Record<string, unknown>;
}

export interface BreadcrumbJsonLdItem {
  readonly name: string;
  readonly url?: string;
}

export interface BreadcrumbJsonLdProps {
  readonly items: readonly BreadcrumbJsonLdItem[];
}
