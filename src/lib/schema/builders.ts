import type {
  ArticleSchema,
  BreadcrumbItemSchema,
  BreadcrumbListSchema,
  OrganizationSchema,
  ProductSchema,
  SoftwareApplicationSchema,
  WebPageSchema,
  WebSiteSchema,
} from "@/types/schema";

export function buildOrganizationSchema(
  data: Omit<OrganizationSchema, "@context" | "@type">,
): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    ...data,
  };
}

export function buildWebSiteSchema(data: Omit<WebSiteSchema, "@context" | "@type">): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    ...data,
  };
}

export function buildWebPageSchema(data: Omit<WebPageSchema, "@context">): WebPageSchema {
  return {
    "@context": "https://schema.org",
    ...data,
  };
}

export function buildBreadcrumbSchema(
  items: readonly { name: string; url?: string }[],
): BreadcrumbListSchema {
  const itemListElement: BreadcrumbItemSchema[] = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(item.url ? { item: item.url } : {}),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

export function buildArticleSchema(data: Omit<ArticleSchema, "@context">): ArticleSchema {
  return {
    "@context": "https://schema.org",
    ...data,
  };
}

export function buildProductSchema(data: Omit<ProductSchema, "@context" | "@type">): ProductSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    ...data,
  };
}

export function buildSoftwareApplicationSchema(
  data: Omit<SoftwareApplicationSchema, "@context" | "@type">,
): SoftwareApplicationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    ...data,
  };
}
