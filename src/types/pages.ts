import type { ReactNode } from "react";

import type {
  ContentSection,
  Dictionary,
  DictionaryHome,
  LegalPageContent,
  SearchI18n,
} from "@/validation/i18n";

export interface PageProps<
  TParams = Record<string, string | string[]>,
  TSearchParams = Record<string, string | string[] | undefined>,
> {
  readonly params: Promise<TParams>;
  readonly searchParams: Promise<TSearchParams>;
}

export interface SectionProps {
  readonly className?: string;
  readonly children?: ReactNode;
}

export interface HomePageProps {
  readonly currentLocale?: string;
  readonly dictionary?: Dictionary;
}

export interface ContactSectionProps {
  readonly contactI18n?: DictionaryHome["contact"];
}

export interface DedicatedSearchPageProps {
  readonly locale: string;
  readonly searchI18n: SearchI18n;
  readonly initialQuery?: string;
  readonly initialType?: string;
  readonly initialSort?: string;
  readonly initialPage?: number;
}

export interface LegalDocumentPageProps {
  readonly content: LegalPageContent;
}

export interface LocalizedContentProps {
  readonly sections: readonly ContentSection[];
  readonly className?: string;
}
