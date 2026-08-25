## 1. Compounding Math Core

- [x] 1.1 Write failing tests for a closed-form `projectBalance` helper (principal growth + monthly-contribution annuity, arbitrary compounding frequency)
- [x] 1.2 Implement the helper to pass; keep it pure and dependency-free
- [x] 1.3 Add a `series` helper returning balance-over-time points for the curve, with tests
- [x] 1.4 Add `toReal` + `realSeries` (inflation-adjusted) helpers, with tests

## 2. Sandbox Core UI

- [x] 2.1 Build the controls (principal, monthly contribution, rate, years, inflation, compounding frequency) with no default rate
- [x] 2.2 Wire controls → math core → live projected balance + real/contributed/growth breakdown
- [x] 2.3 Add locale/currency selection using `Intl.NumberFormat`; no hard-coded symbol
- [x] 2.4 Tests: changing an input updates the projection; no projection until a rate is chosen; inflation drives the real value

## 3. Hero Curve

- [x] 3.1 Render the balance-over-time curve (SVG, zero new deps) from the `series` helper, with a dashed real (inflation-adjusted) line
- [x] 3.2 Add entrance animation; disable it under `prefers-reduced-motion` while keeping the curve legible
- [x] 3.3 Tests: curve reflects inputs; accessible value summary present

## 4. Framing & Routing

- [x] 4.1 Add a "not financial advice" disclaimer; ensure no product/return is recommended
- [x] 4.2 Reach the lab from the landing "Compound Interest Lab" card via a hash route (`#lab/compound-interest`)

## 5. Verification & Docs

- [x] 5.1 Full gate green locally: lint → format check → test → build
- [x] 5.2 Add a per-directory `AGENTS.md` for the new lab directory
- [x] 5.3 `openspec validate compound-interest-lab` passes

## Deferred (cut from v1)

Guided narrative acts — predict/reveal, two-savers, fees, debt, and the
age→retirement plan with formula/inflation toggles — are out of v1 scope and
left for a follow-up change.
