"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ResolvedTheme, ThemeContextValue, ThemePreference } from "@/types/theme";

const THEME_STORAGE_KEY = "app-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(defaultPreference: ThemePreference): ThemePreference {
  if (typeof window === "undefined") return defaultPreference;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {}
  return defaultPreference;
}

function applyThemeToDocument(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export interface ThemeProviderProps {
  readonly children: ReactNode;
  readonly defaultTheme?: ThemePreference;
}

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const initialTheme = getStoredTheme(defaultTheme);
    setThemeState(initialTheme);
    const resolved = initialTheme === "system" ? getSystemTheme() : initialTheme;
    setResolvedTheme(resolved);
    applyThemeToDocument(resolved);
  }, [defaultTheme]);

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      const resolved = event.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyThemeToDocument(resolved);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemePreference) => {
    setThemeState(newTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {}

    const resolved = newTheme === "system" ? getSystemTheme() : newTheme;
    setResolvedTheme(resolved);
    applyThemeToDocument(resolved);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
