import { createEnv } from "@t3-oss/env-nextjs";

import { clientEnvSchema, serverEnvSchema } from "@/validation/env";

export const env = createEnv({
  server: serverEnvSchema,
  client: clientEnvSchema,
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    VERCEL: process.env.VERCEL,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  },
  emptyStringAsUndefined: true,
});
