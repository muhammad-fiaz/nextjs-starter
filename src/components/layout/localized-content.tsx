import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { LocalizedContentProps } from "@/types/pages";
import type { ContentBlock } from "@/validation/i18n";

export type { LocalizedContentProps } from "@/types/pages";

function renderBlock(block: ContentBlock, index: number): ReactNode {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="text-muted-foreground leading-relaxed">
          {block.text}
        </p>
      );

    case "list":
      if (block.ordered) {
        return (
          <ol key={index} className="text-muted-foreground list-decimal space-y-2 pl-6">
            {block.items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul key={index} className="text-muted-foreground list-disc space-y-2 pl-6">
          {block.items.map((item, itemIdx) => (
            <li key={itemIdx}>{item}</li>
          ))}
        </ul>
      );

    case "callout":
      return (
        <div
          key={index}
          className={cn(
            "my-4 rounded-lg border p-4 text-sm",
            block.variant === "warning" &&
              "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
            block.variant === "info" &&
              "border-blue-500/30 bg-blue-500/10 text-blue-900 dark:text-blue-200",
            block.variant === "success" &&
              "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200",
            block.variant === "default" && "border-border/60 bg-muted/40 text-foreground",
          )}
        >
          {block.title && <h4 className="mb-1 font-semibold">{block.title}</h4>}
          <p>{block.text}</p>
        </div>
      );

    case "link":
      return (
        <p key={index}>
          <a
            href={block.href}
            className="text-primary hover:underline"
            target={block.href.startsWith("http") ? "_blank" : undefined}
            rel={block.href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {block.label}
          </a>
        </p>
      );

    default:
      return null;
  }
}

export function LocalizedContent({ sections, className }: LocalizedContentProps): ReactNode {
  return (
    <div className={cn("space-y-10", className)}>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{section.heading}</h2>
          <div className="space-y-3">
            {section.blocks.map((block, idx) => renderBlock(block, idx))}
          </div>
        </section>
      ))}
    </div>
  );
}
