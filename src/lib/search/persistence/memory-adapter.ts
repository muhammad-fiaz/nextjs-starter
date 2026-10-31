import type { SearchPersistenceAdapter } from "@/types/search";

export class MemoryPersistenceAdapter implements SearchPersistenceAdapter {
  private readonly store = new Map<string, unknown>();

  public async save(indexName: string, rawData: unknown): Promise<void> {
    this.store.set(indexName, rawData);
  }

  public async load(indexName: string): Promise<unknown | null> {
    return this.store.get(indexName) ?? null;
  }
}

export const memoryPersistenceAdapter = new MemoryPersistenceAdapter();
