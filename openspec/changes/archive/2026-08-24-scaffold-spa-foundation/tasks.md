## 1. Project & Toolchain Setup

- [x] 1.1 Create `package.json` (pnpm, type=module) with dev/build/preview/test/lint/format scripts
- [x] 1.2 Add dependencies: React 19, Vite 8, Vitest 4, Tailwind 4, oxlint, oxfmt, TypeScript 7, Testing Library
- [x] 1.3 Add strict `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`
- [x] 1.4 Configure `vite.config.ts` with React + Tailwind plugins, `base: '/finsight/'`, and Vitest (jsdom) block
- [x] 1.5 Add `.oxlintrc.json` (disable `react-in-jsx-scope` for React 19 automatic runtime)
- [x] 1.6 Add `.prettierignore` so oxfmt never rewrites `.pi/`, `openspec/`, `AGENTS.md`
- [x] 1.7 Add `.gitignore`, `.nvmrc`
- [x] 1.8 Generate `pnpm-lock.yaml` via `pnpm install`

## 2. SPA Application

- [x] 2.1 Add `index.html` SPA entry referencing `/src/main.tsx` and `/finsight/favicon.svg`
- [x] 2.2 Add `src/main.tsx` mounting `App` into `#root` (throws if missing)
- [x] 2.3 Add `src/index.css` with Tailwind v4 import, theme tokens, and reduced-motion-safe ticker keyframes
- [x] 2.4 Add `src/vite-env.d.ts` client types

## 3. Landing Page

- [x] 3.1 Build finance-themed `src/App.tsx`: hero, animated ticker tape, scenario cards, footer
- [x] 3.2 Add `public/favicon.svg` brand mark

## 4. Tests

- [x] 4.1 Add `src/test/setup.ts` wiring jest-dom matchers
- [x] 4.2 Add `src/App.test.tsx` smoke tests (hero heading, primary CTA, scenario cards)

## 5. CI/CD Pipeline

- [x] 5.1 Add `.github/workflows/ci.yml` gate job: install (frozen) → audit → lint → format check → test → build → 404 fallback
- [x] 5.2 Add deploy job publishing `dist/` to GitHub Pages on `main` with Pages permissions/concurrency
- [x] 5.3 Verify full gate passes locally (audit, lint, format, test, build all green)

## 6. Docs

- [x] 6.1 Update `README.md` with stack table, scripts, and Pages deployment note
- [x] 6.2 Add `src/AGENTS.md` per-file directory record
