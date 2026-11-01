"use client";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";

import { getQueryClient } from "@/lib/providers/query-client";

export interface TanStackProviderProps {
  readonly children: ReactNode;
}

export function TanStackProvider({ children }: TanStackProviderProps): ReactNode {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
          <TanStackDevtools config={{ hideUntilHover: true }} plugins={[formDevtoolsPlugin()]} />
        </>
      )}
    </QueryClientProvider>
  );
}
