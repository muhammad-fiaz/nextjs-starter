import type { ReactNode } from "react";

import type { DictionaryFooter, DictionaryNavigation, SearchI18n } from "@/types/i18n";

export interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ lang: string }>;
}

export interface NavbarProps {
  readonly currentLocale?: string;
  readonly navigation?: DictionaryNavigation;
  readonly search?: SearchI18n;
}

export interface FooterProps {
  readonly currentLocale?: string;
  readonly navigation?: DictionaryNavigation;
  readonly footer?: DictionaryFooter;
}

export interface MobileNavProps {
  readonly currentLocale?: string;
  readonly navigation?: DictionaryNavigation;
}

export interface LegalPageRootProps {
  readonly width?: "narrow" | "default" | "full";
  readonly className?: string;
  readonly children: ReactNode;
}

export interface LegalPageHeaderProps {
  readonly className?: string;
  readonly children: ReactNode;
}

export interface LegalPageMetadataProps {
  readonly effectiveDate?: string;
  readonly lastUpdated?: string;
  readonly className?: string;
}

export interface LegalPageTableOfContentsItem {
  readonly id: string;
  readonly title: string;
}

export interface LegalPageTableOfContentsProps {
  readonly title?: string;
  readonly items?: readonly LegalPageTableOfContentsItem[];
  readonly className?: string;
}

export interface LegalPageContentProps {
  readonly className?: string;
  readonly children: ReactNode;
}
