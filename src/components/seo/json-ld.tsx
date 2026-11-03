import type { ReactNode } from "react";

import { getLocalizedPath } from "@/i18n/navigation";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/schema/builders";
import { siteConfig } from "@/site.config";
import type { PostalAddressSchema } from "@/types/schema";
import type { JsonLdProps } from "@/types/seo";

export function JsonLd({ data }: JsonLdProps): ReactNode {
  // Escape "<" so the payload cannot terminate the script element early.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json">{json}</script>;
}

export function GlobalJsonLd({
  locale,
  description,
}: {
  locale?: string;
  description?: string;
}): ReactNode {
  const siteUrl = siteConfig.url?.replace(/\/$/, "") || "http://localhost:3000";
  const activeLocale = locale || siteConfig.i18n.defaultLocale;
  const activeDescription = description || siteConfig.description;

  const sameAs = [
    siteConfig.social?.github,
    siteConfig.social?.twitter,
    siteConfig.social?.linkedin,
    siteConfig.social?.youtube,
  ].filter(Boolean) as string[];

  const postalAddress: PostalAddressSchema | undefined = siteConfig.organization?.address
    ? {
        "@type": "PostalAddress",
        streetAddress: siteConfig.organization.address.streetAddress,
        addressLocality: siteConfig.organization.address.addressLocality,
        addressRegion: siteConfig.organization.address.addressRegion,
        postalCode: siteConfig.organization.address.postalCode,
        addressCountry: siteConfig.organization.address.addressCountry,
      }
    : undefined;

  const organizationSchema = buildOrganizationSchema({
    "@id": `${siteUrl}#organization`,
    name: siteConfig.organization?.name || siteConfig.name,
    legalName: siteConfig.organization?.legalName,
    url: siteConfig.organization?.url || siteUrl,
    logo: siteConfig.organization?.logo || `${siteUrl}/icon-512.png`,
    description: activeDescription,
    email: siteConfig.organization?.email,
    telephone: siteConfig.organization?.telephone,
    ...(postalAddress ? { address: postalAddress } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  });

  const searchTargetUrl = `${siteUrl}${getLocalizedPath("/search", activeLocale)}?q={search_term_string}`;

  const webSiteSchema = buildWebSiteSchema({
    "@id": `${siteUrl}#website`,
    name: siteConfig.name,
    url: siteUrl,
    description: activeDescription,
    inLanguage: activeLocale,
    publisher: {
      "@id": `${siteUrl}#organization`,
    },
    ...({
      potentialAction: {
        "@type": "SearchAction",
        target: searchTargetUrl,
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
