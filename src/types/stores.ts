import type { StateCreator } from "zustand";

export type StoreSlice<TState, TActions, TComplete = TState & TActions> = StateCreator<
  TComplete,
  [],
  [],
  TState & TActions
>;

export interface AsyncState<TData = unknown, TError = Error> {
  readonly data: TData | null;
  readonly isLoading: boolean;
  readonly error: TError | null;
}

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
