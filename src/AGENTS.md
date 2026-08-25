# src

Client-side React SPA source. Pure browser app; no server/SSR.

| File | Purpose |
|---|---|
| `App.test.tsx` | Vitest + Testing Library smoke tests. Assert hero headline, primary CTA, scenario cards render. |
| `App.tsx` | Root component. Exports default `App`. Hash router (`useHash`): renders `CompoundInterestLabPage` at `#lab/compound-interest`, `PortfolioSandboxPage` at `#lab/portfolio-sandbox`, else the landing (hero + `TickerTape` + scenario cards; the Compound Interest Lab and Portfolio Sandbox cards link to their labs). See change: compound-interest-lab, portfolio-sandbox. |
| `index.css` | Tailwind v4 entry (`@import "tailwindcss"`). Defines `@theme` tokens (ink/mint/loss, mono font) + `animate-ticker` + `lab-curve-line` draw keyframes (both reduced-motion aware). |
| `lab/compound-interest/` | Compound Interest Lab feature (first simulation). See its `AGENTS.md`. Reached via hash route `#lab/compound-interest`. See change: compound-interest-lab. |
| `lab/portfolio-sandbox/` | Portfolio Sandbox feature (second simulation): shared asset-model build panel + seven lenses (personalities, diversify, Sharpe, fees/inflation, seeded Monte Carlo cone, historical time-machine, behavior drills). See its `AGENTS.md`. Reached via hash route `#lab/portfolio-sandbox`. See change: portfolio-sandbox. |
| `main.tsx` | Entry point. Mounts `App` into `#root` via `createRoot` under `StrictMode`. Throws if `#root` missing. |
| `test/setup.ts` | Vitest global setup. Imports `@testing-library/jest-dom/vitest` matchers. |
| `vite-env.d.ts` | Vite client type reference. |
