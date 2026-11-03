import type { ReactNode } from "react";

export interface ChartConfig {
  readonly [key: string]: {
    readonly label?: ReactNode;
    readonly icon?: React.ComponentType;
  } & (
    | { readonly color?: string; readonly theme?: never }
    | { readonly color?: never; readonly theme: Record<"light" | "dark", string> }
  );
}
