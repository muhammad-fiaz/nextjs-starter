import { create } from "zustand";

import type { UIStore } from "@/types/stores";

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
