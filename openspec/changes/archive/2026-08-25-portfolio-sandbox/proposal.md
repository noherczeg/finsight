## Why

The landing page teases a **Portfolio Sandbox** — *"Balance risk and reward
across simulated asset classes"* — but nothing backs it yet. It is finsight's
second simulation and the natural sequel to the Compound Interest Lab: tab 1
taught that growth **compounds**; tab 2 teaches that growth is **uncertain**,
and how the mix you choose shapes that uncertainty.

The pedagogical payload is the shift from a single deterministic curve to a
**distribution of possible futures**. Beginners picture one outcome; the sandbox
makes them feel the cone. Diversification — "the only free lunch in investing"
(Markowitz; taught interactively at Wharton's *Mechanics of Diversification*) —
is the counter-intuitive core: combining assets can cut risk below any single
holding. The sandbox meets this head-on with an honest, hands-on explorer: build
one asset mix, then view it through many lenses.

## Discipline Skills

`observability-instrumentation` does not apply (pure client-side). The seeded
Monte Carlo path may trigger `performance-optimization` if a naive sampler is
slow; `systematic-debugging` if the seeded PRNG is non-reproducible.

## What Changes

- Add a **Portfolio Sandbox**: an interactive explorer reached from the landing
  "Portfolio Sandbox" card via a hash route (`#lab/portfolio-sandbox`).
- **One shared model on the left** — a set of asset classes, each with an
  expected return, a volatility, and a fee, plus a correlation between them; the
  learner sets weights (an allocation mix) and a contribution plan.
- **Nine lenses on the right**, all deriving from that single model:
  - **① Asset personalities** — each class's return/volatility temperament.
  - **③ Diversification** — a correlation control; combined risk vs the parts.
  - **⑦ Sharpe score** — reward per unit of risk for the current mix.
  - **⑬ Fee drag** — expense-ratio erosion over the horizon (tab-1 framing).
  - **⑭ Inflation lens** — the dashed "today's money" real line, reused.
  - **⑯ Monte Carlo cone** — many **seeded** sampled futures, p10/p50/p90.
  - **⑰ Historical time-machine** — replay the mix through real decades.
  - **⑪ Panic drill** — a scripted crash; hold vs sell, and the cost of selling.
  - **⑫ DCA vs lump sum** — two contribution schedules over one path.
- **Predict-first gate** — the Monte Carlo cone stays hidden until the learner
  commits a guess about where they'll land (echoes tab 1's "no default rate").
- **Deterministic where possible, seeded where not** — Sharpe/fees/inflation/
  frontier are closed-form; the cone uses a **seeded** PRNG (reproducible,
  testable); the time-machine is deterministic replay of bundled real data.
- **"Not financial advice"** disclaimer; **locale-flexible** currency.

## Capabilities

### New Capabilities
- `portfolio-sandbox`: the interactive explorer — the shared asset-model spine,
  the nine lenses, the predict-first cone gate, the seeded-randomness contract,
  and the bundled historical-returns dataset contract.

### Modified Capabilities
<!-- None — the landing page already lists the sandbox as a teaser; this change
     realizes it without altering the landing-page contract. -->

## Impact

- **New code**: a lab feature under `src/lab/portfolio-sandbox/` (React
  components for the mix controls and each lens, a pure portfolio-math core, a
  seeded PRNG + sampler, an SVG cone/curve renderer), plus tests.
- **Routing**: a second hash route (`#lab/portfolio-sandbox`) alongside the
  existing compound-interest route; no router dependency.
- **Dependencies**: zero new runtime deps — closed-form math + hand-rolled
  seeded PRNG + plain SVG. The historical lens bundles a small **static JSON**
  of annual asset-class returns (no network, no runtime dep).
- **Data**: a bundled `returns.json` (stocks / bonds / cash / gold, annual,
  1971→present) derived from Damodaran's (NYU) *Historical Returns on Stocks,
  Bonds and Bills* table — a single source carrying all four classes. Window
  starts 1971 (gold was pegged pre-1971). Provenance recorded in the lab
  `AGENTS.md`.
- **Out of scope (v1)**: the other 11 candidate topics (efficient frontier as an
  interactive plot, rebalancing bands, tax/asset-location, safe withdrawal rate,
  fat-tail sampling, risk-tolerance quiz, lazy-portfolio showdown, etc.); real
  ticker data; individual stocks; short selling; leverage; multi-currency
  correlation.
- **Docs**: a per-directory `AGENTS.md` for the new lab directory.
