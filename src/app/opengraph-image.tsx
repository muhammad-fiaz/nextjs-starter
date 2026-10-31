import type { ImageResponse } from "next/og";

import {
  createDynamicOgImage,
  defaultOgContentType,
  defaultOgDimensions,
} from "@/lib/og/generate-og";

export const size = defaultOgDimensions;
export const contentType = defaultOgContentType;

export default async function Image({
  searchParams,
}: {
  searchParams?: Promise<{ title?: string; description?: string; category?: string }>;
}): Promise<ImageResponse> {
  const params = await searchParams;
  return createDynamicOgImage({
    title: params?.title,
    description: params?.description,
    category: params?.category,
  });
}
