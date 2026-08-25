# src/lab/compound-interest

Compound Interest Lab — finsight's first simulation. v1 is a **pure parameter
sandbox**: sliders drive one animated SVG curve + a live balance breakdown. Pure
client-side, deterministic closed-form math, zero runtime deps. The guided
narrative acts (predict/reveal, two-savers, fees, debt, plan) were cut from v1
and deferred to a later change. See change: compound-interest-lab.

| File | Purpose |
|---|---|
| `AGENTS.md` | This file. |
| `CompoundInterestLab.tsx` | Main component. Exports `CompoundInterestLab`. Left card: sliders (principal, monthly, rate, years, inflation, compounding buttons, currency select). Right card: `Curve` (nominal + dashed real line) + breakdown: projected balance / worth today (real) / contributed / growth. No default rate — `rate` inits `null`, results gated behind `RatePrompt` until chosen. |
| `CompoundInterestLab.test.tsx` | Component tests: no-default-rate gate, sliders drive projection, inflation drives the real value, locale currency, disclaimer, back link. NOTE: sliders start at displayed default 5 — tests choose rate 7 so React's value-tracker fires onChange. |
| `Curve.tsx` | Exports `Curve`, `CurveLine`. Pure SVG growing curve, multi-line + area fill + legend (nominal solid, real dashed). Accessible `role="img"` aria-label carries peak value. `.lab-curve-line` draw animation; dashed lines skip the class (CSS dasharray would clobber the dash). |
| `LabPage.tsx` | Exports `CompoundInterestLabPage`. Full-page shell: back link (`#`), heading, `CompoundInterestLab`, not-financial-advice disclaimer. |
| `format.ts` | Exports `LOCALES`, `Locale`, `formatCurrency`. `Intl.NumberFormat` currency, whole units. No hard-coded symbol. |
| `format.test.ts` | Currency formatting per locale; whole-unit rounding. |
| `math.ts` | Pure closed-form compounding. Exports `CompoundInput`, `SeriesPoint`, `projectBalance` (P(1+i)^N + annuity; monthly contribution spread so annual saved is invariant to frequency), `series` (yearly points), `toReal` (nominal→today's money), `realSeries` (discount a series point-by-point). Deterministic, no deps. |
| `math.test.ts` | Math contracts: zero-rate linearity, principal-only compounding, monotonicity, frequency invariance, series endpoints, real discounting. |
