# Contributing to Next.js Starter

Thank you for your interest in contributing to **Next.js Starter**! We welcome community contributions to keep this foundation fast, secure, accessible, and up to date with the latest Next.js and React developments.

## Code of Conduct

All contributors and participants are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating.

## How Can You Contribute?

- **Reporting Bugs**: Open an issue describing the expected vs. actual behavior, steps to reproduce, and your environment.
- **Suggesting Enhancements**: Submit feature requests with clear use cases and design rationales.
- **Submitting Pull Requests**: Implement bug fixes, performance enhancements, documentation updates, or new starter features.

## Development Workflow

1. **Fork and Clone**:

   ```bash
   git clone https://github.com/muhammad-fiaz/nextjs-starter.git
   cd nextjs-starter
   ```

2. **Install Dependencies**:

   ```bash
   bun install
   ```

3. **Run the Development Server**:

   ```bash
   bun run dev
   ```

4. **Verify Quality Standards**:
   Before submitting your changes, ensure all formatting, lint checks, tests, and build checks pass:
   ```bash
   bun run format:check
   bun run lint
   bun test
   bun run build
   ```

## Architectural Guidelines

- **Centralized Configuration**: All branding, i18n, cookie policies, and integrations belong in `src/site.config.ts`.
- **Modular Types**: Store all TypeScript contracts in `src/types/` organized by domain.
- **Route-Group Mirroring**: Keep Next.js route adapters in `src/app/` thin and delegate page composition to `src/components/pages/`.
- **Shadcn UI & Icons**: Use components from `src/components/ui/` and standard custom icons from `src/components/icons/`.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
