import type { ReactNode } from "react";

import type { DictionaryFooter, DictionaryNavigation, SearchI18n } from "@/validation/i18n";

export interface BaseLayoutProps {
  readonly children: ReactNode;
}

export interface HeaderLayoutProps extends BaseLayoutProps {
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
}

export interface DashboardLayoutProps extends BaseLayoutProps {
  readonly sidebar?: ReactNode;
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
}

export interface AuthLayoutProps extends BaseLayoutProps {
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
  readonly banner?: ReactNode;
}

export interface DocumentationLayoutProps extends BaseLayoutProps {
  readonly sidebar?: ReactNode;
  readonly header?: ReactNode;
  readonly toc?: ReactNode;
  readonly footer?: ReactNode;
}

export interface SiteHeaderProps {
  readonly currentLocale?: string;
  readonly navigation?: DictionaryNavigation;
  readonly search?: SearchI18n;
}

export interface SiteFooterProps {
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
