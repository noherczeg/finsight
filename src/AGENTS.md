# src

Client-side React SPA source. Pure browser app; no server/SSR.

| File | Purpose |
|---|---|
| `App.test.tsx` | Vitest + Testing Library smoke tests. Assert hero headline, primary CTA, scenario cards render. |
| `App.tsx` | Root landing component. Exports default `App`. Finance-themed hero + scrolling `TickerTape` + scenario cards. Static content only. |
| `index.css` | Tailwind v4 entry (`@import "tailwindcss"`). Defines `@theme` tokens (ink/mint/loss, mono font) + `animate-ticker` keyframes (reduced-motion aware). |
| `main.tsx` | Entry point. Mounts `App` into `#root` via `createRoot` under `StrictMode`. Throws if `#root` missing. |
| `test/setup.ts` | Vitest global setup. Imports `@testing-library/jest-dom/vitest` matchers. |
| `vite-env.d.ts` | Vite client type reference. |
