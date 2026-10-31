import type { ReactNode } from "react";

import type { ThingSchema } from "@/types/schema";

export interface JsonLdProps {
  readonly data: ThingSchema | readonly ThingSchema[];
}

/**
 * Safely renders JSON-LD structured data script tag with XSS protection.
 */
export function JsonLd({ data }: JsonLdProps): ReactNode {
  // Sanitize to prevent script injection
  const jsonString = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: jsonString,
      }}
    />
  );
}
