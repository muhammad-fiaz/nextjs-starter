import type { AnySchema } from "@orama/orama";

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
