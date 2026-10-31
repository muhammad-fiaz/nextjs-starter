import type { ReactNode } from "react";

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
