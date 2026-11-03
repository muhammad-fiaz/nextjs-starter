<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Architecture & Agent Development Rules

Always prioritize user instructions over defaults. Follow this canonical folder structure, modular architecture, and coding conventions across the codebase:

---

## 1. Directory Structure Conventions

```text
src/
├── app/                      # App Router: Route entry points, dynamic routes, handlers, and metadata
├── components/
│   ├── ui/                   # Reusable shadcn/ui components (always reuse; do not reinvent UI primitives)
│   ├── pages/                # Page components and sections for each route and slug (e.g., (marketing)/home, (marketing)/search/sections)
│   ├── layout/               # Layout shells, headers, footers, navbars, and mobile menus
│   ├── cookies/              # Cookie consent & preferences UI
│   │   ├── cookie-consent-banner.tsx
│   │   ├── cookie-consent-manager.tsx
│   │   ├── cookie-preferences-button.tsx
│   │   └── cookie-preferences-dialog.tsx
│   ├── integrations/         # Third-party analytics, tracking, and advertising integrations
│   │   ├── clarity/
│   │   ├── google/
│   │   ├── vercel/
│   │   └── integration-manager.tsx
│   ├── pwa/                  # PWA install buttons and prompt UI
│   ├── providers/            # Top-level client providers (theme, query, etc.)
│   └── states/               # Empty, loading, and error states
├── hooks/                    # Reusable custom React hooks
├── i18n/                     # Internationalization navigation, dictionary loading, and routing logic
├── lib/                      # Core business logic, utilities, SEO builders, schema helpers
├── query/                    # TanStack Query clients, query options, and query keys
├── stores/                   # Zustand global stores (UI store, consent store, etc.)
├── types/                    # Core TypeScript interfaces, type definitions, and schema contracts
├── validation/               # Zod validation schemas and environment validation
├── env.ts                    # T3 Env central environment access and validation
└── site.config.ts            # Single source of truth for all global application configuration
```

---

## 2. Configuration & Environment Variables

- **`src/site.config.ts`**:
  - The **single source of truth** for all application settings: identity, branding, organization information, author details, social links, i18n configuration, PWA settings, cookie policies, and integration flags.
  - Never hardcode configuration strings in UI components or routes.
  - Derive the base URL directly from `env.NEXT_PUBLIC_APP_URL`.
- **`src/env.ts`**:
  - All environment variables and API keys from `.env` / `.env.local` must be declared and accessed exclusively through `src/env.ts` using `@t3-oss/env-nextjs`.
  - **Never** call `process.env` directly within application or client components.
  - Keep secrets restricted to the server environment schema; expose only public variables prefixed with `NEXT_PUBLIC_` to the client.

---

## 3. Validation & Typing Standards

- **Zod Schemas (`src/validation/`)**:
  - Place **all** Zod schemas in `src/validation/` (e.g., `i18n.ts`, `env.ts`, `contact.ts`).
  - Validation schemas must be strictly typed, well-structured, and reusable across server actions, route handlers, and client forms.
- **TypeScript Types (`src/types/`)**:
  - Place all application-wide types and interfaces in `src/types/` (e.g., `config.ts`, `i18n.ts`, `schema.ts`, `stores.ts`, `cookies.ts`).
  - Keep TypeScript strict with no loose `any` types.

---

## 4. State Management, Querying & Hooks

- **Zustand Stores (`src/stores/`)**:
  - Place all global client state stores in `src/stores/` (e.g., `ui-store.ts`, `consent-store.ts`).
  - Keep stores lightweight, focused, and free of unnecessary side-effects.
- **TanStack Query (`src/query/`)**:
  - Place query clients, query key factories, and query options in `src/query/` (e.g., `query-client.ts`, `search-query-options.ts`).
  - Reuse query options between server prefetching and client consumers.
- **Custom Hooks (`src/hooks/`)**:
  - Place all shared React hooks in `src/hooks/` (e.g., `use-debounce.ts`, `use-clipboard.ts`).
  - Keep hooks focused, avoiding unnecessary `useEffect` or state synchronization when derived values suffice.

---

## 5. UI Components, Styling & Design System

- **shadcn/ui Reusability (`src/components/ui/`)**:
  - Always check and reuse existing shadcn/ui components (`Button`, `Card`, `Badge`, `Dialog`, `Command`, `Input`, `Field`, `Accordion`, `DropdownMenu`, etc.) rather than reinventing UI primitives.
  - Keep styling consistent with Tailwind CSS v4 using theme tokens defined in `src/app/globals.css`.
- **Responsive Design & Mobile-First UX**:
  - All pages and UI sections must be designed responsively for mobile, tablet, and desktop viewports.
  - Maintain fluid layouts, touch-friendly tap targets, readable typographic scale, and collapsible navigation across all screen sizes.
- **Route Grouping & Architecture (`src/app/`)**:
  - Maintain standard Next.js route groups (`(marketing)`, `(legal)`) and nested layout structures across localized routes (`src/app/[lang]/...`).
  - Keep root assets, static handlers, dynamic image generators, feeds, and error boundaries in `src/app/` (`apple-icon.tsx`, `icon.tsx`, `icon-192.png`, `icon-512.png`, `opengraph-image`, `twitter-image`, `rss.xml`, `manifest.ts`, `robots.ts`, `sitemap.ts`, `not-found.tsx`, `error.tsx`, `global-error.tsx`).
- **Page Sections & System Pages (`src/components/pages/`)**:
  - Separate route definitions (`src/app/`) from page view implementations.
  - Place page-level components and modular sections in `src/components/pages/<slug>/` (e.g., `src/components/pages/(marketing)/home/`, `src/components/pages/(marketing)/search/sections/`).
  - **Legal Pages (`src/components/pages/(legal)/`)**: Common defaults for all applications (`cookies`, `privacy`, `terms`). Preserve unless explicitly asked to remove.
  - **System & Error Pages (`src/components/pages/(system)/`)**: Standard error handling and recovery pages (`error`, `forbidden`, `global-error`, `maintenance`, `not-found`, `offline`, `service-unavailable`, `unauthorized`). Always keep and update UI/UX across iterations rather than deleting.
- **Layouts (`src/components/layout/`)**:
  - Place shared headers, navigation bars, footers, and legal page wrappers in `src/components/layout/`.
- **Cookies & Privacy UI (`src/components/cookies/`)**:
  - Reuse `CookieConsentManager`, `CookieConsentBanner`, `CookiePreferencesButton`, and `CookiePreferencesDialog`.
  - Ensure cookie compliance matches `src/site.config.ts` cookie configuration.
- **Integrations (`src/components/integrations/`)**:
  - Place all analytics and third-party scripts under `src/components/integrations/` (Clarity, Google Analytics / GTM, Vercel Analytics / Speed Insights) managed dynamically by `integration-manager.tsx`.
- **PWA & Offline (`src/components/pwa/`)**:
  - PWA support is automatic out of the box via `PWAProvider` (`pwa-provider.tsx`), registering the service worker based on `siteConfig.pwa`.
  - `PWAInstallButton` (`pwa-install-button.tsx`) is an **optional UI component** — do not add it to navigation bars or page headers by default unless the user explicitly requests an install button.
  - `PushNotificationManager` (`push-notification-manager.tsx`) provides opt-in Web Push notifications when required.

---

## 6. Links, Navigation & Accessibility

- **Internal routes**: Strictly use `next/link` for prefetching and client-side navigation.
- **External websites & social links**: Always use native `<a>` with `target="_blank"`, `rel="noopener noreferrer"`, and screen-reader accessible anchor text (`<span className="sr-only">...</span>`).
- **Email & Telephone**: Use `<a href="mailto:...">` and `<a href="tel:...">`.
- **In-page anchors**: Use `<a href="#section">`.
- Never use clickable `div` or `span` elements in place of semantic links or buttons.

---

## 7. Internationalization (i18n) & SEO

- **Dictionary-Driven Content**:
  - All public copy, UI labels, section texts, navigation items, and page-specific SEO strings (titles, descriptions, Open Graph text) must strictly come from locale dictionary files (`locales/en.json`, `locales/es.json`, or any newly added locale files).
  - When creating or modifying new UI components, sections, pages, or forms, **never hardcode user-facing copy or fallback strings directly in `.tsx` files**. Always add the respective keys to `locales/en.json` (as the default source based on `siteConfig.i18n.defaultLocale`) and corresponding keys to all other supported locales (e.g. `locales/es.json`).
  - When a user requests adding a new language, create `locales/<lang>.json` mirroring `locales/en.json`, register the language in `siteConfig.i18n.locales`, and update `src/validation/i18n-config.ts`.
- **Single-Locale / Non-i18n Fallback**:
  - If i18n is disabled in `site.config.ts` (`siteConfig.i18n.enabled: false`), the application must serve only the default language (`siteConfig.i18n.defaultLocale`, default `en`), reading from `locales/en.json` without prefixing routes.
  - If i18n is permanently removed by user instruction, replace dynamic `getDictionary(lang).seo.<page>` calls with direct configuration values from `src/site.config.ts`, route constants, or backend APIs as specified by user requirements.
- **Structured Data (Schema.org)**:
  - Generate standards-compliant JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`) localized per route and rendered via `src/components/seo/json-ld.tsx`.

---

## 8. Icons & Visual Assets

- **Default Icon Set**: Strictly use `lucide-react` by default across all components.
- **Brand & Social Icons**: When `lucide-react` does not provide an official brand or third-party company logo (e.g., GitHub, Twitter / X, WhatsApp, Facebook, Discord, etc.), place or reuse SVGs in `src/components/icons/social-icons.tsx`.
- **Installed Dependencies**: Always reuse dependencies already listed in `package.json`. Avoid installing redundant third-party libraries for primitives already covered.

---

## 9. Feature Pruning & Modular Removal Guidelines

When removing or disabling modular features upon explicit request:

- **Search System Pruning**:
  - If search is not needed, remove only the isolated search files: `src/app/[lang]/(marketing)/search/page.tsx`, `src/components/pages/(marketing)/search/`, `src/types/search.ts`, `src/validation/search.ts`, and `src/query/search-query-options.ts`, along with search triggers in navigation shells, without breaking other pages.
- **i18n Architecture Removal / Toggle**:
  - Always respect `siteConfig.i18n.enabled`.
  - If complete removal from the project is requested: migrate pages from `src/app/[lang]/` to the root `src/app/` first, update route references, and then clean up `src/validation/i18n-config.ts`, `src/validation/i18n.ts`, `src/types/i18n.ts`, and `src/i18n/`.
  - Never delete unrelated layout or business logic during feature removal.

---

## 10. AI Agent Discovery & WebMCP Standards

- **Agentic Resource Discovery & Catalogs (`public/`)**:
  - Keep AI discovery files synchronized with route additions, slug modifications, and capabilities:
    - `public/.well-known/ard.json`: Formal Agentic Resource Discovery (ARD) catalog.
    - `public/.well-known/ai-catalog.json`: Model Context Protocol & AI catalog manifest.
    - `public/llms.txt`: Structured plain text overview of pages, routes, API endpoints, and technical capabilities for LLMs and crawler agents.
    - `public/sw.js`: PWA Service Worker caching policies and offline fallback routing.
- **WebMCP Forms & Agent Tool Integration**:
  - For interactive user input and forms, wrap form controls using `WebMCPForm` (`src/components/ui/webmcp-form.tsx`) to provide automatic agent tool annotations alongside normal DOM events.
  - Register contextual tools and actions via `useWebMCPTool` / `registerWebMCPTool` in `src/lib/webmcp/registry.ts` and `src/components/providers/webmcp-provider.tsx` for seamless autonomous agent interactions.

---

## 11. Quality Assurance & Verification Commands

Always run and verify these checks before completing tasks. Ensure 0 errors and 0 warnings:

```bash
bun check             # TypeScript type checking
bun test              # Bun test suite
bun run format:check  # Code formatting validation
bun run build         # Next.js production Turbopack build
```
