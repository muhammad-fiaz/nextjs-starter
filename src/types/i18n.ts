import type { z } from "zod";

import type {
  contentBlockSchema,
  contentSectionSchema,
  dictionarySchema,
  legalPageContentSchema,
  pageSeoSchema,
  searchI18nSchema,
  seoDictionarySchema,
} from "@/validation/i18n";

export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type ContentSection = z.infer<typeof contentSectionSchema>;
export type LegalPageContent = z.infer<typeof legalPageContentSchema>;
export type SearchI18n = z.infer<typeof searchI18nSchema>;
export type Dictionary = z.infer<typeof dictionarySchema>;

export type DictionaryNavigation = Dictionary["navigation"];
export type DictionaryHome = Dictionary["home"];
export type DictionaryFooter = Dictionary["footer"];
export type DictionaryCommon = Dictionary["common"];
export type PageSeo = z.infer<typeof pageSeoSchema>;
export type SeoDictionary = z.infer<typeof seoDictionarySchema>;
