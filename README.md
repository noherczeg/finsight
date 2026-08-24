# finsight

Learn the world of finance through browser-based simulations and realistic,
simplified scenarios.

A pure client-side SPA built with Vite + React, styled with Tailwind, linted
and formatted with the Oxc toolchain, and tested with Vitest.

## Stack

| Concern      | Tool                          |
| ------------ | ----------------------------- |
| Build / dev  | Vite 8                        |
| UI           | React 19                      |
| Styling      | Tailwind CSS 4                |
| Lint         | oxlint (Oxc)                  |
| Format       | oxfmt (Oxc)                   |
| Test         | Vitest 4 + Testing Library    |
| Types        | TypeScript 7                  |
| CI / hosting | GitHub Actions → GitHub Pages |

## Getting started

```bash
pnpm install          # install dependencies
pnpm dev              # start the dev server
```

## Scripts

```bash
pnpm dev              # start Vite dev server
pnpm build            # typecheck + production build to dist/
pnpm preview          # preview the production build
pnpm test             # run the test suite once
pnpm test:watch       # run tests in watch mode
pnpm lint             # oxlint
pnpm format           # format the codebase in place (oxfmt)
pnpm format:check     # verify formatting without writing (CI)
```

## Deployment

Pushes to `main` run the CI gate (install → audit → lint → format check →
test → build) and, when green, publish `dist/` to GitHub Pages at
`https://noherczeg.github.io/finsight/`.

> Enable Pages once in the repo settings: **Settings → Pages → Build and
> deployment → Source: GitHub Actions.**

The Vite `base` is set to `/finsight/` to match the project Pages URL.
