import { create } from "zustand";

import {
  clearStoredConsent,
  COOKIE_CONSENT_KEY,
  getStoredConsent,
  setStoredConsent,
} from "@/lib/cookies/consent-storage";
import type { StoredConsentRecord } from "@/types/cookies";
import type { ConsentStore } from "@/types/stores";

let initialized = false;

export const useConsentStore = create<ConsentStore>((set) => ({
  record: null,
  isLoaded: false,

  initialize: () => {
    if (initialized || typeof window === "undefined") return;
    initialized = true;

    set({ record: getStoredConsent(), isLoaded: true });

    window.addEventListener("storage", (event) => {
      if (event.key === COOKIE_CONSENT_KEY) {
        set({ record: getStoredConsent() });
      }
    });

    window.addEventListener("consentDecisionChanged", (event) => {
      const detail = (event as CustomEvent<StoredConsentRecord | null>).detail;
      set({ record: detail ?? null });
    });
  },

  accept: () => set({ record: setStoredConsent("accepted") }),
  deny: () => set({ record: setStoredConsent("denied") }),
  setCategoryConsent: (categories) => set({ record: setStoredConsent("custom", categories) }),
  resetConsent: () => {
    clearStoredConsent();
    set({ record: null });
  },
}));
