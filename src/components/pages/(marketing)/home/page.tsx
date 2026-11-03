import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Globe,
  Layers,
  Lock,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { GithubIcon } from "@/components/icons/social-icons";
import { ContactSection } from "@/components/pages/(marketing)/home/contact-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalizedPath } from "@/i18n/navigation";
import { siteConfig } from "@/site.config";
import type { HomePageProps } from "@/types/pages";

export default function HomePage({ currentLocale, dictionary }: HomePageProps): ReactNode {
  const hero = dictionary?.home.hero;
  const features = dictionary?.home.features;
  const architecture = dictionary?.home.architecture;

  const featureCards = [
    {
      id: "nextjs",
      icon: Zap,
      title: features?.items.nextjs.title,
      description: features?.items.nextjs.description,
    },
    {
      id: "i18n",
      icon: Globe,
      title: features?.items.i18n.title,
      description: features?.items.i18n.description,
    },
    {
      id: "privacy",
      icon: Lock,
      title: features?.items.privacy.title,
      description: features?.items.privacy.description,
    },
    {
      id: "seo",
      icon: Search,
      title: features?.items.seo.title,
      description: features?.items.seo.description,
    },
    {
      id: "modular-types",
      icon: Layers,
      title: features?.items.modularTypes.title,
      description: features?.items.modularTypes.description,
    },
    {
      id: "shadcn",
      icon: Code2,
      title: features?.items.shadcn.title,
      description: features?.items.shadcn.description,
    },
    {
      id: "webmcp",
      icon: Bot,
      title: features?.items.webmcp?.title,
      description: features?.items.webmcp?.description,
    },
  ];

  const architectureItems = architecture?.items || [];

  return (
    <>
      <section className="border-border/40 relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden border-b py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            {hero?.badge && (
              <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
                <Sparkles className="text-primary h-3.5 w-3.5" />
                {hero.badge}
              </Badge>
            )}

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {hero?.titlePrimary} <br />
              <span className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent">
                {hero?.titleHighlight}
              </span>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
              {hero?.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {hero?.exploreFeatures && (
                <Link
                  href={getLocalizedPath("/#features", currentLocale)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium shadow-xs transition-colors"
                >
                  {hero.exploreFeatures} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {siteConfig.social?.github && hero?.viewGithub && (
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border bg-background hover:bg-muted hover:text-foreground inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium shadow-xs transition-colors"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>{hero.viewGithub}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{features?.heading}</h2>
            <p className="text-muted-foreground mt-4 text-base">{features?.subheading}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} className="hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="architecture" className="border-border/40 bg-muted/20 border-t py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              {architecture?.heading}
            </h2>
            <div className="space-y-3">
              {architectureItems.map((item) => (
                <div
                  key={item}
                  className="border-border/60 bg-card flex items-start gap-3 rounded-lg border p-4 text-sm"
                >
                  <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactSection contactI18n={dictionary?.home.contact} />
    </>
  );
}
