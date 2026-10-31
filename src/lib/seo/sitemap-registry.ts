import type { SitemapEntry } from "@/types/seo";

export class SitemapRegistry {
  private readonly entries: Map<string, SitemapEntry> = new Map();

  public register(entry: SitemapEntry): void {
    this.entries.set(entry.url, entry);
  }

  public registerMany(entries: readonly SitemapEntry[]): void {
    for (const entry of entries) {
      this.register(entry);
    }
  }

  public getEntries(): SitemapEntry[] {
    return Array.from(this.entries.values());
  }
}

export const sitemapRegistry = new SitemapRegistry();
