import Image from "next/image";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export type ImageProps = ComponentProps<typeof Image>;

/**
 * Reusable, strongly typed Image component wrapping next/image.
 * Preserves all native Next.js optimization capabilities, responsive sizing, and accessibility.
 */
export function AppImage({ className, alt, ...props }: ImageProps) {
  return (
    <Image className={cn("transition-opacity duration-300", className)} alt={alt} {...props} />
  );
}
