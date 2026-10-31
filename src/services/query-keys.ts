import type { QueryKeyFactory } from "@/types/query";

/**
 * Creates a strongly typed query key factory for resources.
 * Ensures consistent, predictable cache invalidation and queries.
 */
export function createQueryKeyFactory<TRoot extends string>(root: TRoot): QueryKeyFactory<TRoot> {
  return {
    all: [root] as const,
    lists: () => [root, "list"] as const,
    list: (params?: unknown) => [root, "list", params] as const,
    details: () => [root, "detail"] as const,
    detail: (id: string | number) => [root, "detail", id] as const,
  };
}
