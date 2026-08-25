## Context

The Compound Interest Lab is finsight's first simulation. Its job is to make
*exponential growth visible* to a total beginner who tends to picture savings
growing in a straight line. v1 does that with an honest parameter sandbox:
sliders drive one animated curve and a live balance breakdown.

> **Scope revision.** An earlier draft of this design centred on a guided
> **predict → reveal → reflect** loop and a five-act narrative. That layer was
> cut: v1 is the **pure sandbox** only. The narrative acts are recorded below as
> explicit non-goals and remain a candidate for a follow-up change.

Constraints: pure client-side SPA (no backend), GitHub Pages static hosting,
pnpm, and the repo doctrine in `AGENTS.md` (surgical changes, simplicity-first,
per-directory `AGENTS.md`). Serious/clean tone — no gamification.

## Goals / Non-Goals

**Goals:**
- A parameter sandbox where sliders (principal, monthly, rate, years, inflation,
  compounding) drive one animated growing curve in real time.
- Show *why* the total is what it is: projected balance, its real (inflation-
  adjusted) value, total contributed, and growth added, broken out — with a
  dashed real line on the curve.
- Honest defaults: no pre-filled "expected return", locale-flexible currency,
  explicit "not financial advice" disclaimer.

**Non-Goals (v1):**
- The guided narrative acts — predict/reveal, two-savers, fees, debt, and the
  age→retirement plan with the formula toggle. Deferred to a later change.
  (Inflation / real-vs-nominal is kept in v1 as a first-class sandbox control.)
- Variable/random returns, Monte Carlo, taxes, withdrawals/drawdown, multiple
  accounts.
- Gamification (streaks, confetti, scores).
- A generic reusable "Lab shell" abstraction — this ships standalone; keep the
  core clean enough to *extract* later without building the abstraction now.

## Decisions

- **Pure parameter sandbox.** Sliders → one animated curve → a live balance
  breakdown. No narrative sequencing in v1.
- **One hero visual: an animated growing curve.** A single SVG chart keeps the
  message focused on the shape of the growth.
- **Deterministic, closed-form math.** Balance is computed analytically
  (principal growth + contribution annuity), not simulated. Fast, exact, no deps.
  Stochastic returns are explicitly deferred to a later change.
- **No Rule of 72 / doubling-time framing.** Per product decision, narrate with
  the curve and dollar amounts, not doubling metaphors. (Doubling-time was
  considered — evidence supports it — but rejected to keep one consistent
  framing for beginners.)
- **No default interest rate.** Forcing the learner to pick a rate avoids
  implying a "right" number and sidesteps the not-advice risk.
- **Locale-flexible currency, deterministic formatting.** Use `Intl.NumberFormat`
  with a selectable locale/currency; no hard-coded `$`.
- **Zero new runtime dependencies as the default.** Render the curve with SVG.
  Introduce a charting library only if a later task proves SVG insufficient —
  and record that as its own decision.

## Risks / Trade-offs

- **A sandbox alone may under-sell the bias** → the live contributed-vs-growth
  breakdown makes the exponential share explicit; the narrative acts that would
  drive the point harder are deferred, not lost.
- **Animation vs accessibility** → follow the existing landing-page precedent:
  respect `prefers-reduced-motion`; the curve must be fully legible without
  animation.
- **"Not financial advice" exposure** → explicit disclaimer, no product names,
  no default/recommended rate.
- **Extract-later temptation** → resist building a Lab-shell abstraction now;
  keep the sandbox core cohesive so extraction stays cheap if a second lab lands.

## Resolved Questions

- **Routing → lightweight hash view-switch, zero deps.** `App` reads
  `window.location.hash` via a `useHash` hook and renders the lab page at
  `#lab/compound-interest`, else the landing. Matches the existing anchor-link
  style, keeps deep-linking + back-button, and adds no router dependency.
- **Narrative acts → deferred.** The predict/reveal loop, two-savers, fees,
  debt, and plan acts are cut from v1 and left for a follow-up change; v1 ships
  the pure sandbox.
