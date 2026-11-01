import { notFound } from "next/navigation";

import { dictionaries } from "@/i18n/dictionaries";
import { isSupportedLocale } from "@/i18n/validation";
import type { Locale } from "@/types/config";
import type { Dictionary } from "@/types/i18n";

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const loader = dictionaries[locale];
  if (!loader) {
    notFound();
  }

  return await loader();
}
