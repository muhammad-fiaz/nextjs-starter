<h1 align="center">Next.js Starter</h1>

<p align="center">
  <a href="https://github.com/muhammad-fiaz/nextjs-starter/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.4.4-black?logo=next.js" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.3.1-blue?logo=react" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-7.0.2-blue?logo=typescript" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.3.4-38bdf8?logo=tailwindcss" alt="Tailwind CSS" /></a>
  <a href="https://bun.sh/"><img src="https://img.shields.io/badge/Bun-1.4.4-fbf0df?logo=bun" alt="Bun" /></a>
  <a href="https://github.com/muhammad-fiaz/nextjs-starter/issues"><img src="https://img.shields.io/github/issues/muhammad-fiaz/nextjs-starter?color=green" alt="Issues" /></a>
  <a href="https://github.com/muhammad-fiaz/nextjs-starter/pulls"><img src="https://img.shields.io/github/issues-pr/muhammad-fiaz/nextjs-starter?color=blue" alt="Pull Requests" /></a>
  <a href="https://github.com/muhammad-fiaz/nextjs-starter"><img src="https://img.shields.io/github/last-commit/muhammad-fiaz/nextjs-starter" alt="Last Commit" /></a>
</p>

Production-ready, infrastructure-first open-source Next.js 16 starter template featuring React 19, TypeScript, Tailwind CSS v4, Base UI / Shadcn UI components, centralized modular types, privacy & cookie consent infrastructure, and toggleable zero-overhead internationalization (i18n).

---

## 1. Features & Highlights

- **Next.js 16 & Turbopack**: App Router, Partial Prerendering (PPR), and Cache Components for instant performance.
- **Toggleable Native Internationalization (i18n)**: Centrally configured in `src/site.config.ts` (`enabled: true/false`, `locales`, `localePrefix`), with zero heavy runtime bloat and English (`en`) + Spanish (`es`) dictionary support.
- **Privacy & GDPR Compliance**: Modular cookie consent management, script-gating provider (`IntegrationManager`), and structured legal page wrappers.
- **Enterprise SEO & OpenGraph**: Centralized metadata inheritance (`createPageMetadata`), native dynamic App Router `ImageResponse` (`opengraph-image.tsx`, `twitter-image.tsx`), automated localized sitemap, and production robots.txt.
- **Modular Type Architecture**: Clean separation of domain interfaces in `src/types/` (`api`, `config`, `cookies`, `errors`, `layouts`, `legal`, `pages`, `pwa`, `query`, `schema`, `search`, `seo`, `services`, `stores`, `theme`, `utils`).
- **Accessible UI Primitives**: Extensive Shadcn and Base UI component library with dark/light theme switching and custom SVG social icons (`GithubIcon`, `LinkedInIcon`, `FacebookIcon`, `InstagramIcon`, `YouTubeIcon`).
- **State & Data Fetching**: TanStack React Query v5 preconfigured with query factories and Zustand stores.

---

## 2. Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (version 1.2+ recommended) or Node.js 20+

### Installation

```bash
# Clone the repository
git clone https://github.com/muhammad-fiaz/nextjs-starter.git
cd nextjs-starter

# Install dependencies
bun install
```

### Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Project Structure

```text
src/
├── app/                       # Next.js App Router route adapters
│   ├── [lang]/                # Localized dynamic segment
│   │   ├── (marketing)/       # Localized marketing routes (/en, /es)
│   │   ├── (legal)/           # Localized legal pages (/en/privacy, /en/terms, etc.)
│   │   └── (api)/             # Localized API status overview
│   ├── manifest.ts            # PWA Web App Manifest
│   ├── opengraph-image.tsx    # Native dynamic OpenGraph ImageResponse
│   ├── twitter-image.tsx      # Native dynamic Twitter Card ImageResponse
│   ├── robots.ts              # Crawler policies with production disallow paths
│   └── sitemap.ts             # Dynamic multi-locale XML sitemap
├── components/
│   ├── cookies/               # Cookie consent provider and banner
│   ├── errors/                # Unified atomic system error pages
│   ├── icons/                 # Custom SVG icons (GitHub, Facebook, LinkedIn, etc.)
│   ├── integrations/          # Third-party integrations (Clarity, GA, GTM, Vercel)
│   ├── layout/                # Navbar, Footer, MobileNav, LegalPage
│   ├── pages/                 # Composed page implementations
│   ├── providers/             # TanStack Query, ThemeProvider, PWAProvider
│   ├── seo/                   # JSON-LD structured data and breadcrumbs
│   └── ui/                    # Shadcn UI / Base UI accessible components
├── i18n/                      # Server-side dictionary loader and locale configuration
├── lib/                       # API clients, SEO helpers, search, schema builders
├── services/                  # Universal API client and TanStack query keys
├── stores/                    # Zustand stores (UI, search, layout)
├── types/                     # Centralized, strongly-typed domain interfaces
├── env.ts                     # Type-safe environment validation
├── proxy.ts                   # Next.js 16 proxy routing handler
└── site.config.ts             # Central configuration single source of truth
```

---

## 4. Scripts

| Command                | Description                                   |
| :--------------------- | :-------------------------------------------- |
| `bun run dev`          | Start development server with Turbopack       |
| `bun run build`        | Build optimized production bundle             |
| `bun run start`        | Start production server                       |
| `bun run lint`         | Run TypeScript type checker (`bun check`)     |
| `bun run format`       | Format code with Bun formatter (`bun fmt`)    |
| `bun run format:check` | Check code formatting without modifying files |
| `bun test`             | Execute unit test suite                       |

---

## 5. Contributing

Contributions are warmly welcomed! Please read our [Contributing Guidelines](CONTRIBUTING.md) and adhere to the [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 6. License

This project is licensed under the [MIT License](LICENSE) &copy; 2026 [Muhammad Fiaz](https://github.com/muhammad-fiaz).
