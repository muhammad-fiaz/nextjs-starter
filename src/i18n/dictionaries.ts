import type { Dictionary } from "@/i18n/types";
import { dictionarySchema } from "@/i18n/types";

/**
 * Universal dynamic dictionary loaders for all discovered locale JSON files.
 * Add new languages simply by placing a valid `<locale>.json` in `src/i18n/locales/`.
 */
export const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: async () => {
    const raw = await import("@/i18n/locales/en.json");
    return dictionarySchema.parse(raw.default);
  },
  es: async () => {
    const raw = await import("@/i18n/locales/es.json");
    return dictionarySchema.parse(raw.default);
  },
};
