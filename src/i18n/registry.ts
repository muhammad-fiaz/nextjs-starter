import { readdirSync } from "node:fs";
import { join } from "node:path";

export function getAvailableLocales(): string[] {
  try {
    const localesDir = join(process.cwd(), "locales");
    const files = readdirSync(localesDir);
    return files.filter((file) => file.endsWith(".json")).map((file) => file.replace(".json", ""));
  } catch {
    return ["en", "es"];
  }
}

export const discoveredLocales: readonly string[] = getAvailableLocales();
