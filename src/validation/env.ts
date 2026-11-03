import { z } from "zod";

export const serverEnvSchema = {
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VERCEL: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
};

export const clientEnvSchema = {
  NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.url().optional(),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional(),
};
