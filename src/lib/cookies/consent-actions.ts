"use server";

import { cookies } from "next/headers";

import { env } from "@/env";
import type { CookieAttributes } from "@/types/cookies";

function toCookieOptions(attributes: CookieAttributes = {}) {
  return {
    ...(attributes.maxAge !== undefined ? { maxAge: attributes.maxAge } : {}),
    ...(attributes.expires ? { expires: attributes.expires } : {}),
    path: attributes.path ?? "/",
    ...(attributes.domain ? { domain: attributes.domain } : {}),
    secure: attributes.secure ?? env.NODE_ENV === "production",
    sameSite: attributes.sameSite ?? "lax",
  };
}

export async function persistCookie(
  name: string,
  value: string,
  attributes: CookieAttributes = {},
): Promise<void> {
  if (!name) return;

  const cookieStore = await cookies();
  cookieStore.set(name, value, toCookieOptions(attributes));
}

export async function removeCookie(options: {
  readonly name: string;
  readonly path?: string;
  readonly domain?: string;
}): Promise<void> {
  if (!options.name) return;

  const cookieStore = await cookies();
  cookieStore.delete({
    name: options.name,
    path: options.path ?? "/",
    ...(options.domain ? { domain: options.domain } : {}),
  });
}
