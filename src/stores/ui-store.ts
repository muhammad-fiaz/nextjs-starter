import { create } from "zustand";

import type { UIActions, UIState } from "@/types/stores";

export type UIStore = UIState & UIActions;

/**
 * Reusable client-side UI store for transient state (drawers, sidebars, modals).
 * Server-safe and hydration friendly.
 */
export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: false,
  isSearchOpen: false,
  themeMode: "system",

  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setThemeMode: (mode) => set({ themeMode: mode }),
}));
