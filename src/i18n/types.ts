import { z } from "zod";

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("paragraph"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("list"),
    ordered: z.boolean().default(false),
    items: z.array(z.string()),
  }),
  z.object({
    type: z.literal("callout"),
    title: z.string().optional(),
    text: z.string(),
    variant: z.enum(["info", "warning", "success", "default"]).default("default"),
  }),
  z.object({
    type: z.literal("link"),
    label: z.string(),
    href: z.string(),
  }),
]);

export type ContentBlock = z.infer<typeof contentBlockSchema>;

export const contentSectionSchema = z.object({
  id: z.string(),
  heading: z.string(),
  blocks: z.array(contentBlockSchema),
});

export type ContentSection = z.infer<typeof contentSectionSchema>;

export const pageMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
});

export const legalPageContentSchema = z.object({
  metadata: pageMetadataSchema,
  title: z.string(),
  description: z.string(),
  effectiveDate: z.string().optional(),
  lastUpdated: z.string().optional(),
  sections: z.array(contentSectionSchema),
});

export type LegalPageContent = z.infer<typeof legalPageContentSchema>;

export const apiEndpointSchema = z.object({
  method: z.string(),
  path: z.string(),
  desc: z.string(),
  category: z.string().default("System"),
});

export type ApiEndpoint = z.infer<typeof apiEndpointSchema>;

export const apiPageContentSchema = z.object({
  metadata: pageMetadataSchema,
  badge: z.string(),
  title: z.string(),
  description: z.string(),
  endpoints: z.array(apiEndpointSchema),
  returnHome: z.string(),
});

export type ApiPageContent = z.infer<typeof apiPageContentSchema>;

export const searchI18nSchema = z.object({
  placeholder: z.string(),
  triggerText: z.string(),
  emptyTitle: z.string(),
  emptyDescription: z.string(),
  initialPrompt: z.string().default("Enter a search term to find content."),
  resultsHeading: z.string(),
  suggestionsHeading: z.string().default("Suggestions"),
  noSuggestions: z.string().default("No suggestions available"),
  quickLinksHeading: z.string(),
  pagesCategory: z.string(),
  sectionsCategory: z.string(),
  legalCategory: z.string(),
  developerCategory: z.string(),
  title: z.string().default("Search"),
  pageDescription: z.string().default("Explore documentation, guides, APIs, and legal policies."),
  allFilter: z.string().default("All"),
  filtersHeading: z.string().default("Filters"),
  contentTypeHeading: z.string().default("Content Type"),
  sortByHeading: z.string().default("Sort by"),
  relevanceSort: z.string().default("Relevance"),
  titleAscSort: z.string().default("Title (A-Z)"),
  titleDescSort: z.string().default("Title (Z-A)"),
  resultsFoundText: z.string().default("results found"),
  clearFiltersText: z.string().default("Clear all filters"),
  previousPageText: z.string().default("Previous"),
  nextPageText: z.string().default("Next"),
  pageIndicatorText: z.string().default("Page"),
  loadingText: z.string().default("Searching..."),
});

export type SearchI18n = z.infer<typeof searchI18nSchema>;

export const dictionarySchema = z.object({
  metadata: z.object({
    language: z.string(),
    locale: z.string(),
    direction: z.enum(["ltr", "rtl"]).default("ltr"),
  }),
  common: z.object({
    appName: z.string(),
    description: z.string(),
    theme: z.object({
      light: z.string(),
      dark: z.string(),
      system: z.string(),
      toggleLabel: z.string(),
    }),
    actions: z.object({
      retry: z.string(),
      goHome: z.string(),
      close: z.string(),
      accept: z.string(),
      deny: z.string(),
    }),
  }),
  navigation: z.object({
    home: z.string(),
    features: z.string(),
    architecture: z.string(),
    api: z.string().default("API"),
    search: z.string().default("Search"),
    about: z.string().optional(),
    contact: z.string().optional(),
    privacy: z.string(),
    terms: z.string(),
    cookies: z.string(),
    github: z.string(),
    selectLanguage: z.string(),
  }),
  search: searchI18nSchema,
  home: z.object({
    hero: z.object({
      badge: z.string(),
      titlePrimary: z.string(),
      titleHighlight: z.string(),
      description: z.string(),
      exploreFeatures: z.string(),
      viewGithub: z.string(),
    }),
    features: z.object({
      heading: z.string(),
      subheading: z.string(),
      items: z.record(
        z.string(),
        z.object({
          title: z.string(),
          description: z.string(),
        }),
      ),
    }),
    architecture: z.object({
      heading: z.string(),
      items: z.array(z.string()),
    }),
  }),
  cookies: z.object({
    title: z.string(),
    description: z.string(),
    policyLinkText: z.string(),
  }),
  offline: z.object({
    title: z.string(),
    description: z.string(),
    retryAction: z.string(),
  }),
  footer: z.object({
    navigationHeading: z.string(),
    legalHeading: z.string(),
    copyright: z.string(),
  }),
  pages: z.object({
    api: apiPageContentSchema,
    legal: z.object({
      privacy: legalPageContentSchema,
      terms: legalPageContentSchema,
      cookies: legalPageContentSchema,
    }),
  }),
});

export type Dictionary = z.infer<typeof dictionarySchema>;
export type DictionaryCommon = Dictionary["common"];
export type DictionaryNavigation = Dictionary["navigation"];
export type DictionaryHome = Dictionary["home"];
export type DictionaryCookies = Dictionary["cookies"];
export type DictionaryOffline = Dictionary["offline"];
export type DictionaryFooter = Dictionary["footer"];
