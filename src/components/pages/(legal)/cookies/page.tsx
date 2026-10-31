import type { ReactNode } from "react";

import { LegalPage } from "@/components/layout/legal-page";
import { LocalizedContent } from "@/components/layout/localized-content";
import type { LegalPageContent } from "@/i18n/types";

interface CookiePolicyPageProps {
  readonly content: LegalPageContent;
}

export default function CookiePolicyPage({ content }: CookiePolicyPageProps): ReactNode {
  return (
    <main className="min-h-[70vh] w-full">
      <LegalPage.Root width="default">
        <LegalPage.Header>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          <LegalPage.Metadata
            effectiveDate={content.effectiveDate}
            lastUpdated={content.lastUpdated}
          />
        </LegalPage.Header>

        <LegalPage.TableOfContents />

        <LegalPage.Content>
          <LocalizedContent sections={content.sections} />
        </LegalPage.Content>
      </LegalPage.Root>
    </main>
  );
}
