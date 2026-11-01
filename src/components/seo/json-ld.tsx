import type { ReactNode } from "react";

import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/schema/builders";
import { siteConfig } from "@/site.config";
import type { ThingSchema } from "@/types/schema";

export interface JsonLdProps {
  readonly data: ThingSchema | Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps): ReactNode {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

export function GlobalJsonLd(): ReactNode {
  const siteUrl = siteConfig.url?.replace(/\/$/, "") || "http://localhost:3000";

  const organizationSchema = buildOrganizationSchema({
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    ...(siteConfig.social?.github ? { sameAs: [siteConfig.social.github] } : {}),
  });

  const webSiteSchema = buildWebSiteSchema({
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    inLanguage: siteConfig.i18n.defaultLocale,
    ...({
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    } as Record<string, unknown>),
  });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={webSiteSchema} />
    </>
  );
}
