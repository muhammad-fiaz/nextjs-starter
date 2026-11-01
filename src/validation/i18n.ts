import { z } from "zod";

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("paragraph"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("list"),
    ordered: z.boolean(),
    items: z.array(z.string()),
  }),
  z.object({
    type: z.literal("callout"),
    title: z.string().optional(),
    text: z.string(),
    variant: z.enum(["info", "warning", "success", "default"]),
  }),
  z.object({
    type: z.literal("link"),
    label: z.string(),
    href: z.string(),
  }),
]);

export const contentSectionSchema = z.object({
  id: z.string(),
  heading: z.string(),
  blocks: z.array(contentBlockSchema),
});

export const legalPageContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  effectiveDate: z.string().optional(),
  lastUpdated: z.string().optional(),
  sections: z.array(contentSectionSchema),
});

export const searchI18nSchema = z.object({
  placeholder: z.string(),
  triggerText: z.string(),
  emptyTitle: z.string(),
  emptyDescription: z.string(),
  initialPrompt: z.string(),
  resultsHeading: z.string(),
  suggestionsHeading: z.string(),
  noSuggestions: z.string(),
  quickLinksHeading: z.string(),
  pagesCategory: z.string(),
  sectionsCategory: z.string(),
  legalCategory: z.string(),
  developerCategory: z.string(),
  allFilter: z.string(),
  filtersHeading: z.string(),
  contentTypeHeading: z.string(),
  sortByHeading: z.string(),
  relevanceSort: z.string(),
  titleAscSort: z.string(),
  titleDescSort: z.string(),
  resultsFoundText: z.string(),
  clearFiltersText: z.string(),
  previousPageText: z.string(),
  nextPageText: z.string(),
  pageIndicatorText: z.string(),
  loadingText: z.string(),
});

export const dictionarySchema = z.object({
  metadata: z.object({
    language: z.string(),
    locale: z.string(),
    direction: z.enum(["ltr", "rtl"]),
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
    search: z.string(),
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
    contact: z.object({
      badge: z.string(),
      heading: z.string(),
      subheading: z.string(),
      nameLabel: z.string(),
      namePlaceholder: z.string(),
      emailLabel: z.string(),
      emailPlaceholder: z.string(),
      messageLabel: z.string(),
      messagePlaceholder: z.string(),
      submitButton: z.string(),
      submittingButton: z.string(),
      resetButton: z.string().optional(),
      successTitle: z.string(),
      successDescription: z.string(),
      errorNameRequired: z.string(),
      errorEmailInvalid: z.string(),
      errorMessageRequired: z.string(),
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
    legal: z.object({
      privacy: legalPageContentSchema,
      terms: legalPageContentSchema,
      cookies: legalPageContentSchema,
    }),
  }),
});

export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type ContentSection = z.infer<typeof contentSectionSchema>;
export type LegalPageContent = z.infer<typeof legalPageContentSchema>;
export type SearchI18n = z.infer<typeof searchI18nSchema>;
export type Dictionary = z.infer<typeof dictionarySchema>;

export type DictionaryMetadata = Dictionary["metadata"];
export type DictionaryCommon = Dictionary["common"];
export type DictionaryNavigation = Dictionary["navigation"];
export type DictionaryHome = Dictionary["home"];
export type DictionaryCookies = Dictionary["cookies"];
export type DictionaryOffline = Dictionary["offline"];
export type DictionaryFooter = Dictionary["footer"];
export type DictionaryPages = Dictionary["pages"];
