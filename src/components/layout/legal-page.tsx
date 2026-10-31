import type { ReactNode } from "react";

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

export function LegalPageRoot({
  width = "default",
  className = "",
  children,
}: LegalPageRootProps): ReactNode {
  const widthClasses = {
    narrow: "max-w-2xl",
    default: "max-w-4xl",
    full: "max-w-none",
  }[width];

  return (
    <article
      className={`prose prose-zinc dark:prose-invert mx-auto min-h-[calc(100vh-16rem)] w-full px-4 py-10 sm:px-6 lg:py-14 print:max-w-none print:px-0 print:py-0 ${widthClasses} ${className}`}
    >
      {children}
    </article>
  );
}

export function LegalPageHeader({ className = "", children }: LegalPageHeaderProps): ReactNode {
  return (
    <header
      className={`border-border not-prose [&>h1]:text-foreground [&>p]:text-muted-foreground mb-10 space-y-3 border-b pb-8 print:mb-6 print:border-b-2 print:pb-4 [&>h1]:text-3xl [&>h1]:font-extrabold [&>h1]:tracking-tight sm:[&>h1]:text-4xl [&>p]:text-base sm:[&>p]:text-lg ${className}`}
    >
      {children}
    </header>
  );
}

export function LegalPageMetadata({
  effectiveDate,
  lastUpdated,
  className = "",
}: LegalPageMetadataProps): ReactNode {
  if (!effectiveDate && !lastUpdated) return null;

  return (
    <div
      className={`text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 pt-3 text-xs sm:text-sm print:text-xs ${className}`}
    >
      {effectiveDate ? <span>Effective Date: {effectiveDate}</span> : null}
      {lastUpdated ? <span>Last Updated: {lastUpdated}</span> : null}
    </div>
  );
}

export function LegalPageTableOfContents({
  title = "Table of Contents",
  items = [],
  className = "",
}: LegalPageTableOfContentsProps): ReactNode {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={title}
      className={`border-border bg-muted/30 not-prose mb-10 rounded-xl border p-5 print:hidden ${className}`}
    >
      <h2 className="text-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
        {title}
      </h2>
      <ul className="m-0 list-none space-y-2 p-0 text-sm">
        {items.map((item, idx) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 transition-colors focus-visible:rounded focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="text-muted-foreground/60 font-mono text-xs">{idx + 1}.</span>
              <span>{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function LegalPageContent({ className = "", children }: LegalPageContentProps): ReactNode {
  return <div className={`space-y-10 print:space-y-6 ${className}`}>{children}</div>;
}

export const LegalPage = Object.assign(LegalPageRoot, {
  Root: LegalPageRoot,
  Header: LegalPageHeader,
  Metadata: LegalPageMetadata,
  TableOfContents: LegalPageTableOfContents,
  Content: LegalPageContent,
});
