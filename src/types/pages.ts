import type {
  ContentSection,
  Dictionary,
  DictionaryHome,
  LegalPageContent,
  SearchI18n,
} from "@/types/i18n";

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
}

export interface LegalDocumentPageProps {
  readonly content: LegalPageContent;
}

export interface LocalizedContentProps {
  readonly sections: readonly ContentSection[];
  readonly className?: string;
}
