import type { ReactNode } from "react";

export interface AppMetadata {
  readonly title: string;
  readonly version: string;
}

export interface ErrorFallbackProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export interface RootLayoutProps {
  readonly children: ReactNode;
}
