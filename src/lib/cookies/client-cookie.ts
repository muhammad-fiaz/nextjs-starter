import { persistCookie, removeCookie } from "@/lib/cookies/consent-actions";
import type { CookieAttributes } from "@/types/cookies";

/**
 * Cookie values are stored URL-encoded so JSON payloads stay valid cookie-octets
 * (raw JSON contains `"` and `,`). Server-side readers must decode the value.
 */
export function decodeCookieValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const entry = part.trim();
    if (entry.startsWith(prefix)) {
      return decodeCookieValue(entry.slice(prefix.length));
    }
  }

  return null;
}

export function setCookie(name: string, value: string, attributes: CookieAttributes = {}): void {
  if (typeof window === "undefined") return;
  void persistCookie(name, encodeURIComponent(value), attributes).catch(() => {
    // Cookie writes are best-effort; consent state stays in the client store.
  });
}

export function deleteCookie(name: string, path: string = "/", domain?: string): void {
  if (typeof window === "undefined") return;
  void removeCookie({ name, path, domain }).catch(() => {
    // Cookie removal is best-effort.
  });
}
