import { type NextRequest } from "next/server";

import { createDynamicOgImage } from "@/lib/og/generate-og";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || undefined;
  const description = searchParams.get("description") || undefined;

  return createDynamicOgImage({
    title,
    description,
  });
}
