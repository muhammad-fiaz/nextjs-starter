export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  readonly theme: ThemePreference;
  readonly resolvedTheme: ResolvedTheme;
  readonly setTheme: (theme: ThemePreference) => void;
}
