import type { Dictionary } from "@/types/i18n";
import { dictionarySchema } from "@/types/i18n";

export const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: async () => {
    const raw = await import("@locales/en.json");
    return dictionarySchema.parse(raw.default);
  },
  es: async () => {
    const raw = await import("@locales/es.json");
    return dictionarySchema.parse(raw.default);
  },
};
