## Why

finsight needs a working, deployable frontend baseline before any finance
simulations can be built. This change establishes that baseline: a pure
client-side SPA, a modern build/lint/format/test toolchain, a branded landing
page, and an automated path from `main` to a public GitHub Pages URL.

> Documented retrospectively: the scaffold was implemented directly, then
> captured as a spec-driven change so the project's baseline contract
> (architecture, toolchain, deploy pipeline) is tracked before feature work.

## What Changes

- Introduce a **pure SPA** (no SSR/server) built with Vite 8 + React 19 +
  TypeScript 7 (strict), styled with Tailwind CSS 4.
- Adopt the **Oxc toolchain**: `oxlint` for linting, `oxfmt` for formatting
  (scoped away from project doctrine/tooling markdown via `.prettierignore`).
- Add a **Vitest 4 + Testing Library** test setup (jsdom) with smoke tests for
  the landing page.
- Ship a **finance-themed landing page** ("finsight — see the money move"):
  animated market ticker, gradient hero, teaser scenario cards.
- Add a **GitHub Actions pipeline**: a gate job (install → audit → lint →
  format check → test → build → SPA 404 fallback) and a deploy job that
  publishes `dist/` to **GitHub Pages** on `main`. Vite `base` is `/finsight/`.

## Capabilities

### New Capabilities
- `spa-foundation`: pure client-side SPA build, toolchain (Vite/React/TS/
  Tailwind/Oxc/Vitest), and project conventions that all features build on.
- `landing-page`: the branded finance-themed hello/landing experience and its
  content contract.
- `ci-cd-pipeline`: automated quality gate and GitHub Pages deployment.

### Modified Capabilities
<!-- None — greenfield baseline; no existing specs. -->

## Impact

- **New code**: `src/` (React app + tests), `index.html`, `public/favicon.svg`,
  `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json`, `.prettierignore`.
- **Dependencies**: React 19, Vite 8, Vitest 4, Tailwind 4, oxlint, oxfmt,
  TypeScript 7, Testing Library. Managed with pnpm (`pnpm-lock.yaml`).
- **CI/CD**: `.github/workflows/ci.yml`; requires repo **Pages → Source:
  GitHub Actions** enabled once. Public URL: `https://noherczeg.github.io/finsight/`.
- **Docs**: `README.md`, `src/AGENTS.md`.
