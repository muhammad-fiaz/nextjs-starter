import type { ReactNode } from "react";

import { buildBreadcrumbSchema } from "@/lib/schema/builders";

import { JsonLd } from "./json-ld";

export interface BreadcrumbJsonLdProps {
  readonly items: readonly { name: string; url?: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps): ReactNode {
  if (!items || items.length === 0) return null;
  const schema = buildBreadcrumbSchema(items);
  return <JsonLd data={schema} />;
}
