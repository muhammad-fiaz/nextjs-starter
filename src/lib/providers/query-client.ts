import { QueryClient } from "@tanstack/react-query";

/**
 * Creates a QueryClient instance with robust production defaults.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time of 1 minute to prevent immediate refetching on window focus
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Server/Client safe QueryClient getter.
 * - On the server: always creates a new QueryClient per request so mutable cache is never shared between requests.
 * - In the browser: reuses the single instance across the client application session.
 */
export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always create a fresh QueryClient
    return makeQueryClient();
  }

  // Browser: initialize or reuse client
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
