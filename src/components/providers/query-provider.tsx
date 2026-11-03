"use client";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";

import { env } from "@/env";
import { getQueryClient } from "@/query/query-client";
import type { TanStackProviderProps } from "@/types/query";

export function TanStackProvider({ children }: TanStackProviderProps): ReactNode {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {env.NEXT_PUBLIC_NODE_ENV === "development" && (
        <>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
          <TanStackDevtools config={{ hideUntilHover: true }} plugins={[formDevtoolsPlugin()]} />
        </>
      )}
    </QueryClientProvider>
  );
}
