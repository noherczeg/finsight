## Context

finsight is a greenfield educational project for learning finance through
browser-based simulations. Before any simulation feature can exist, the project
needs a deployable frontend baseline and an automated quality/deploy pipeline.
This design captures the technical decisions made while scaffolding that
baseline. It is written retrospectively — the code exists — so it also serves
as the record of *why* the stack looks the way it does.

Constraints: static hosting only (GitHub Pages), project-site URL path
`/finsight/`, pnpm as package manager, and the repo doctrine in `AGENTS.md`
(surgical changes, kb-first discipline, per-directory `AGENTS.md`).

## Goals / Non-Goals

**Goals:**
- A pure client-side SPA that runs from any static host.
- A fast, modern lint/format/test/build toolchain.
- A branded, accessible landing page.
- One-push deploy to GitHub Pages gated on quality checks.

**Non-Goals:**
- Any actual finance simulation logic (future changes).
- Routing / multi-page navigation (single landing page for now).
- Backend, auth, persistence, or data fetching.
- SSR / SSG.

## Decisions

- **Pure SPA over SSR/SSG.** No server to run; GitHub Pages is static. Vite +
  React client render is the simplest fit. Alternatives (Next.js, Astro) add
  server/build complexity we don't need for a static learning sandbox.
- **Vite `base: '/finsight/'`.** GitHub project Pages serve under
  `/<repo>/`. Without the base, asset URLs 404. A `404.html` copy of
  `index.html` is emitted in CI so future client routes resolve.
- **Oxc (oxlint + oxfmt) over ESLint + Prettier.** Requested by the project;
  dramatically faster, single toolchain. Trade-off: newer, smaller rule set and
  oxfmt is pre-1.0. Mitigated by pinning exact versions.
- **oxfmt scoped via `.prettierignore`.** oxfmt formats *all* markdown by
  default, which rewrote `AGENTS.md` and `.pi/` doctrine on first run. We ignore
  `.pi/`, `openspec/`, and `AGENTS.md` so formatting never fights doctrine.
- **`react-in-jsx-scope` disabled in oxlint.** React 19's automatic JSX runtime
  makes the legacy rule a false positive.
- **TypeScript 7 (native port), strict.** "Latest stable" per the request.
  Risk noted below.
- **Vitest + Testing Library (jsdom).** Shares Vite's config/transform; native
  fit. Smoke tests assert the landing contract (hero, CTA, scenarios).
- **Single CI workflow, two jobs.** `gate` (install→audit→lint→format→test→
  build) then `deploy` (Pages, `main` only). Keeps the pipeline in one file
  with a clear gate→deploy dependency.

## Risks / Trade-offs

- **TypeScript 7 native port is bleeding-edge** → pinned exact version; `tsc
  --noEmit` runs in CI so incompatibilities surface immediately; can pin back to
  5.x if tooling breaks.
- **oxfmt pre-1.0 formatting may shift between versions** → exact version pin;
  CI `format:check` catches drift.
- **Pages requires a one-time manual setting** (Source: GitHub Actions) → called
  out in README; first deploy will no-op until enabled.
- **`pnpm audit --audit-level=high` could block on an unfixable transitive advisory**
  → level chosen to ignore low/moderate noise; can be adjusted if it blocks.

## Migration Plan

Greenfield — no migration. Rollback is reverting the scaffold commit; GitHub
Pages retains the last successful deployment until a new one succeeds.

## Open Questions

- Keep TypeScript 7 or pin to 5.x LTS once real feature code lands?
- Introduce a router (and real SPA fallback need) when the first simulation
  ships?
