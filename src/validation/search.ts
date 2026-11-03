import { z } from "zod";

export const searchDocumentSchema = z.object({
  id: z.string().min(1),
  locale: z.string().min(2),
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().optional(),
  url: z.string().min(1),
  canonicalUrl: z.string().optional(),
  type: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  source: z.string().min(1),
  published: z.boolean().default(true),
  updatedAt: z.number().optional(),
  author: z.string().optional(),
  imageUrl: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
