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
import { type ReactNode } from "react";

import { GithubIcon } from "@/components/icons/social-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalizedPath } from "@/i18n/navigation";
import type { Dictionary } from "@/i18n/types";
import { siteConfig } from "@/site.config";

interface HomePageProps {
  readonly currentLocale?: string;
  readonly dictionary?: Dictionary;
}

export default function HomePage({ currentLocale, dictionary }: HomePageProps): ReactNode {
  const hero = dictionary?.home.hero;
  const features = dictionary?.home.features;
  const architecture = dictionary?.home.architecture;
  const nav = dictionary?.navigation;
  const footer = dictionary?.footer;

  const featureCards = [
    {
      icon: Zap,
      title: features?.items.nextjs.title || "Next.js 16 & Turbopack",
      description:
        features?.items.nextjs.description ||
        "Modern App Router, Partial Prerendering (PPR), and Cache Components built for scale and sub-second load times.",
    },
    {
      icon: Globe,
      title: features?.items.i18n.title || "Zero-Overhead i18n",
      description:
        features?.items.i18n.description ||
        "Toggleable native internationalization configured directly from site.config.ts with no heavy third-party runtime bloat.",
    },
    {
      icon: Lock,
      title: features?.items.privacy.title || "Privacy & GDPR Built-in",
      description:
        features?.items.privacy.description ||
        "Modular cookie consent management, automatic script gating, and legal page wrappers (Privacy, Terms, Cookies).",
    },
    {
      icon: Search,
      title: features?.items.seo.title || "Centralized SEO & Metadata",
      description:
        features?.items.seo.description ||
        "Type-safe metadata inheritance, dynamic OpenGraph / Twitter ImageResponse, and automated sitemap & robots.txt.",
    },
    {
      icon: Layers,
      title: features?.items.modularTypes.title || "Modular Type Architecture",
      description:
        features?.items.modularTypes.description ||
        "Strict separation of concerns across domain types (api, config, cookies, legal, seo, schema, stores) with zero duplication.",
    },
    {
      icon: Code2,
      title: features?.items.shadcn.title || "Shadcn UI & Tailwind CSS v4",
      description:
        features?.items.shadcn.description ||
        "Extensive library of accessible UI components styled with modern CSS variables, dark mode, and smooth transitions.",
    },
    {
      icon: Bot,
      title: features?.items.webmcp?.title || "WebMCP & AI Agent Ready",
      description:
        features?.items.webmcp?.description ||
        "Google Chrome WebMCP and ARD standards integrated out-of-the-box for autonomous browser AI agent discoverability and execution.",
    },
  ];

  const architectureItems = architecture?.items || [
    "App Router with dynamic [lang] segment support and legacy root compatibility",
    "Modern proxy routing handler (proxy.ts) adhering to Next.js 16 conventions",
    "Fully typed site configuration (site.config.ts) controlling features at runtime",
    "Offline-ready Progressive Web App (PWA) scaffolding with service worker registration",
    "Integrated Orama full-text search engine with client and server index capabilities",
    "Zustand state management and TanStack React Query v5 preconfigured",
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="border-border/40 relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden border-b py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
              <Sparkles className="text-primary h-3.5 w-3.5" />
              {hero?.badge || "Next.js 16 + React 19 + TypeScript + Tailwind CSS v4"}
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {hero?.titlePrimary || "Infrastructure-First"} <br />
              <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                {hero?.titleHighlight || "Next.js Starter Template"}
              </span>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
              {hero?.description ||
                "A complete, production-grade foundation with enterprise SEO, toggleable i18n, cookie consent compliance, and modern App Router patterns."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href={getLocalizedPath("/#features", currentLocale)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium shadow-xs transition-colors"
              >
                {hero?.exploreFeatures || "Explore Features"} <ArrowRight className="h-4 w-4" />
              </Link>
              {siteConfig.social?.github && (
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border bg-background hover:bg-muted hover:text-foreground inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium shadow-xs transition-colors"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>{hero?.viewGithub || "View on GitHub"}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {features?.heading || "Built for scalable production apps"}
            </h2>
            <p className="text-muted-foreground mt-4 text-base">
              {features?.subheading ||
                "Everything you need to launch immediately without spending days wiring boilerplate."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:border-primary/50 transition-all">
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

      {/* Architecture Checklist */}
      <section id="architecture" className="border-border/40 bg-muted/20 border-t py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              {architecture?.heading || "Core Architecture & Conventions"}
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
    </>
  );
}
