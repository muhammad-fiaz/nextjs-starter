import type { AnySchema } from "@orama/orama";

/**
 * Standard Orama schema for universal document search across client and server.
 * All supported Orama primitives: string, number, boolean, string[], number[].
 */
export const defaultSearchSchema = {
  id: "string",
  locale: "string",
  title: "string",
  description: "string",
  content: "string",
  url: "string",
  canonicalUrl: "string",
  type: "string",
  category: "string",
  tags: "string[]",
  keywords: "string[]",
  source: "string",
  published: "boolean",
  author: "string",
  imageUrl: "string",
  updatedAt: "number",
} as const satisfies AnySchema;

export type DefaultSearchSchema = typeof defaultSearchSchema;
