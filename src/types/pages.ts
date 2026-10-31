import type { ReactNode } from "react";

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
