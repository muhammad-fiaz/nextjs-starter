export type SchemaContext = "https://schema.org";

export interface ThingSchema {
  readonly "@context": SchemaContext;
  readonly "@type": string;
  readonly "@id"?: string;
  readonly name?: string;
  readonly description?: string;
  readonly url?: string;
  readonly image?: string | readonly string[];
}

export interface PostalAddressSchema {
  readonly "@type": "PostalAddress";
  readonly streetAddress?: string;
  readonly addressLocality?: string;
  readonly addressRegion?: string;
  readonly postalCode?: string;
  readonly addressCountry?: string;
}

export interface OrganizationSchema extends ThingSchema {
  readonly "@type": "Organization";
  readonly legalName?: string;
  readonly logo?: string;
  readonly email?: string;
  readonly telephone?: string;
  readonly address?: PostalAddressSchema;
  readonly sameAs?: readonly string[];
}

export interface WebSiteSchema extends ThingSchema {
  readonly "@type": "WebSite";
  readonly publisher?: OrganizationSchema | ThingSchema | { readonly "@id": string };
  readonly inLanguage?: string;
}

export interface WebPageSchema extends ThingSchema {
  readonly "@type": "WebPage" | "AboutPage" | "ContactPage" | "ItemPage";
  readonly isPartOf?: WebSiteSchema | { readonly "@id": string };
  readonly inLanguage?: string;
}

export interface BreadcrumbItemSchema {
  readonly "@type": "ListItem";
  readonly position: number;
  readonly name: string;
  readonly item?: string;
}

export interface BreadcrumbListSchema extends ThingSchema {
  readonly "@type": "BreadcrumbList";
  readonly itemListElement: readonly BreadcrumbItemSchema[];
}

export interface ArticleSchema extends ThingSchema {
  readonly "@type": "Article" | "BlogPosting" | "NewsArticle";
  readonly headline?: string;
  readonly datePublished?: string;
  readonly dateModified?: string;
  readonly author?: ThingSchema | readonly ThingSchema[];
  readonly publisher?: OrganizationSchema | ThingSchema;
}

export interface ProductSchema extends ThingSchema {
  readonly "@type": "Product";
  readonly sku?: string;
  readonly brand?: ThingSchema;
  readonly offers?: {
    readonly "@type": "Offer";
    readonly price?: string | number;
    readonly priceCurrency?: string;
    readonly availability?: string;
    readonly url?: string;
  };
}

export interface SoftwareApplicationSchema extends ThingSchema {
  readonly "@type": "SoftwareApplication";
  readonly operatingSystem?: string;
  readonly applicationCategory?: string;
}
