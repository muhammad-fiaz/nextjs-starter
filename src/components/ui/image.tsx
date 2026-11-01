import Image from "next/image";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export type ImageProps = ComponentProps<typeof Image>;

export function AppImage({ className, alt, ...props }: ImageProps) {
  return (
    <Image className={cn("transition-opacity duration-300", className)} alt={alt} {...props} />
  );
}
