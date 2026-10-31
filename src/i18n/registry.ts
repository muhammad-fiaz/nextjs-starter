import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Returns all available locales by reading the JSON files in src/i18n/locales.
 * Used during build, static generation, server routing, and CLI scripts.
 */
export function getAvailableLocales(): string[] {
  try {
    const localesDir = join(process.cwd(), "src", "i18n", "locales");
    const files = readdirSync(localesDir);
    return files.filter((file) => file.endsWith(".json")).map((file) => file.replace(".json", ""));
  } catch {
    return ["en", "es"];
  }
}

/**
 * Statically discovered available locales at module evaluation.
 */
export const discoveredLocales: readonly string[] = getAvailableLocales();
