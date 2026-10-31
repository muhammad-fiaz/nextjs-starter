import type { ApiPaginationParams } from "@/types/api";

/**
 * Builds a search query string or URLSearchParams from typed pagination & filter parameters.
 */
export function buildQueryString(params?: ApiPaginationParams & Record<string, unknown>): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/**
 * Safe JSON parser utility that returns a fallback value instead of throwing on invalid JSON.
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
