## Context

The Portfolio Sandbox is finsight's second simulation and the sequel to the
Compound Interest Lab. Its job is to make a total beginner *feel the difference*
between a single certain outcome and a **distribution** of possible futures, and
to feel that **diversification** can lower risk without lowering return. v1 does
that with a multi-lens explorer: one asset mix on the left, nine lenses on the
right, all deriving from a single underlying model.

It inherits the tab-1 DNA verbatim: a parameter sandbox (live, no "submit"), a
predict-first commitment gate, a real-vs-nominal dashed line, honest framing
(no recommended mix, "not financial advice"), locale-flexible currency, and
hand-rolled accessible SVG. The one new axis it introduces is **controlled
randomness**.

Constraints: pure client-side SPA (no backend), GitHub Pages static hosting,
pnpm, and the repo doctrine in `AGENTS.md` (surgical changes, simplicity-first,
per-directory `AGENTS.md`). Serious/clean tone — no gamification.

## Goals / Non-Goals

**Goals:**
- One shared **asset model** — classes each with `(μ return, σ volatility, fee)`
  plus a correlation — that the learner shapes via weights and a contribution
  plan, and that feeds every lens.
- Nine lenses over that model: asset personalities, diversification/correlation,
  Sharpe score, fee drag, inflation (real vs nominal), Monte Carlo cone,
  historical time-machine, panic drill, DCA vs lump sum.
- The stochastic lens is **reproducible**: a seeded PRNG means the same mix +
  seed yields the same cone, so it is unit-testable and shareable.
- Honest defaults: no pre-selected "recommended" mix, a predict-first gate on the
  cone, locale-flexible currency, an explicit "not financial advice" disclaimer.

**Non-Goals (v1):**
- The other 11 candidate topics: interactive efficient-frontier plot, 1/N vs
  concentration, volatility-drag lab, sequence-of-returns lab, rebalancing +
  bands, tax drag / asset location, safe withdrawal / 4% rule, fat-tails vs
  bell curve, risk-tolerance quiz, lazy-portfolio showdown. Each is a candidate
  follow-up change.
- Real-time / real ticker data, individual stocks, short selling, leverage,
  optimization/solving for the best mix, multi-period tax modelling.
- Gamification (streaks, confetti, scores).
- A generic reusable "Lab shell" abstraction — ship standalone; keep the core
  clean enough to *extract* later without building the abstraction now.

## Decisions

- **One shared model, many lenses.** Every lens is a pure function of the same
  `{ weights, assets, correlation, plan }` state. This mirrors tab 1's "one math
  core, many views" and keeps each lens independently buildable/testable.
- **Deterministic core + seeded stochastic.** Sharpe, fee drag, inflation, and
  portfolio `(μ_p, σ_p)` are **closed-form**. The Monte Carlo cone samples paths
  from `(μ, Σ)` using a **seeded** PRNG (e.g. mulberry32 + Box–Muller), so it is
  deterministic-under-seed. The historical time-machine is a **deterministic
  replay** of bundled real returns — no randomness at all.
- **Predict-first gate on the cone.** The Monte Carlo cone stays hidden until the
  learner commits a guess about where they'll land — the same commitment device
  as tab 1's "no default rate". Deterministic lenses render immediately.
- **Bundled static historical dataset — Damodaran (NYU), single source.** The
  time-machine needs real data; tab 1 had none. Bundle a small static
  `returns.json` derived from Damodaran's *Historical Returns on Stocks, Bonds
  and Bills* table (`histretSP`), which carries **all four classes in one
  source**: S&P 500 (stocks, incl. dividends), 10-yr T.Bond (bonds), 3-mo T.Bill
  (cash), and Gold. No separate gold series to splice. Ship as a build asset —
  zero runtime deps, no network. **Window starts 1971**, not 1928: gold was
  pegged under Bretton Woods until 1971, so pre-1971 gold "returns" are
  meaningless — starting at 1971 keeps every class honest and still spans
  stagflation, 2008, and 2020. Provenance + the 1971 rationale recorded in the
  lab `AGENTS.md`.
- **Correlation as a single global dial in v1.** Rather than a full editable
  N×N matrix, v1 exposes ONE global correlation dial applied uniformly to every
  risky pair (cash is treated as ~zero-volatility, so it drops out). Rationale:
  the lesson is *feel that lower correlation lowers portfolio risk* — one dial
  makes that cause→effect crisp; a matrix is editing overhead that buries it.
  The synthetic dial is the teaching knob; the **historical lens supplies the
  reality check** (its correlation is whatever it really was, baked into the
  data). Constraint: an equicorrelation matrix is only positive semi-definite
  for ρ ≥ −1/(N−1) (≈ −0.33 at N=4), so the dial's negative end is **clamped**
  to keep the covariance valid for the Cholesky step in the Monte Carlo sampler.
- **Zero new runtime dependencies as the default.** Hand-rolled seeded PRNG and
  plain SVG for the cone/curves. Introduce a library only if a later task proves
  SVG/PRNG insufficient — and record that as its own decision.
- **Locale-flexible currency, deterministic formatting.** Reuse the tab-1
  `format.ts` approach (`Intl.NumberFormat`, selectable locale, no hard-coded
  `$`) — extract or duplicate minimally; do not build a shared abstraction yet.

## Risks / Trade-offs

- **Nine lenses risk sprawl** → they share one model and one left panel; ship the
  deterministic lenses first, then the cone, then the time-machine. Each lens is
  a self-contained panel, so partial delivery is coherent.
- **Randomness vs testability** → seed the PRNG; assert the cone is identical for
  a fixed mix+seed and that percentile ordering holds. No un-seeded `Math.random`.
- **Historical-data provenance / licensing** → use a clearly public dataset,
  record the source and any transforms in the lab `AGENTS.md`; keep the JSON
  small and static.
- **Animation vs accessibility** → follow the landing/tab-1 precedent: respect
  `prefers-reduced-motion`; every lens must be legible without animation, with an
  accessible text summary of the key figure (peak, p50, Sharpe).
- **"Not financial advice" exposure** → explicit disclaimer, no product names, no
  recommended/default mix, synthetic or clearly-historical numbers only.
- **Extract-later temptation** → resist a Lab-shell abstraction now; keep the
  sandbox core cohesive so extraction stays cheap if a third lab lands.

## Open Questions

- **Cone rendering budget** — path count (e.g. 500–1000) vs render cost on a
  low-end device; may pull in `performance-optimization`. Resolve during task 4.

> Resolved during design: the historical dataset (→ Damodaran `histretSP`,
> single source, all four classes, 1971→present) and the correlation UI
> fidelity (→ one global dial, clamped to a PSD-valid range) are settled in
> **Decisions** above.
