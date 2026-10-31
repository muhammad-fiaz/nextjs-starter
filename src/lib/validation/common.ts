import { z } from "zod";

/**
 * Reusable common Zod schemas for pagination, IDs, and search params.
 */
export const paginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
  search: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().min(1, "Identifier cannot be empty"),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, "Slug cannot be empty"),
});

export type PaginationParamsInput = z.infer<typeof paginationParamsSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type SlugParamInput = z.infer<typeof slugParamSchema>;
