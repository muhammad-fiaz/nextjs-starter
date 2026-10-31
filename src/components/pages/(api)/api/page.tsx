import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { getLocalizedPath } from "@/i18n/navigation";
import type { ApiPageContent } from "@/i18n/types";

interface ApiPageProps {
  readonly locale: string;
  readonly content: ApiPageContent;
}

export default function ApiPage({ locale, content }: ApiPageProps): ReactNode {
  return (
    <main className="min-h-[70vh] w-full px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <Badge variant="outline" className="text-xs">
            {content.badge}
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{content.title}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{content.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {content.endpoints.map((ep) => (
            <Card key={ep.path} className="border-border/60">
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-mono text-xs font-bold">
                      {ep.method}
                    </Badge>
                    <Link
                      href={ep.path}
                      className="hover:text-primary font-mono text-sm font-semibold transition-colors"
                      target="_blank"
                    >
                      {ep.path}
                    </Link>
                  </div>
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase">
                    {ep.category}
                  </span>
                </div>
                <CardDescription className="pt-1.5 text-xs">{ep.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="pt-4">
          <Link
            href={getLocalizedPath("/", locale)}
            className="text-muted-foreground hover:text-foreground text-xs font-medium underline"
          >
            &larr; {content.returnHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
