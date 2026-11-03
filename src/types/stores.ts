import type { CookieCategoriesConsent, StoredConsentRecord } from "@/types/cookies";

export interface UIState {
  readonly isSidebarOpen: boolean;
  readonly isSearchOpen: boolean;
  readonly themeMode?: "light" | "dark" | "system";
}

export interface UIActions {
  readonly setSidebarOpen: (isOpen: boolean) => void;
  readonly toggleSidebar: () => void;
  readonly setSearchOpen: (isOpen: boolean) => void;
  readonly toggleSearch: () => void;
  readonly setThemeMode: (mode: "light" | "dark" | "system") => void;
}

export type UIStore = UIState & UIActions;

export interface ConsentStoreState {
  readonly record: StoredConsentRecord | null;
  readonly isLoaded: boolean;
}

export interface ConsentStoreActions {
  readonly initialize: () => void;
  readonly accept: () => void;
  readonly deny: () => void;
  readonly setCategoryConsent: (categories: Partial<CookieCategoriesConsent>) => void;
  readonly resetConsent: () => void;
}

export type ConsentStore = ConsentStoreState & ConsentStoreActions;
