## 1. Portfolio Math Core (shared model)

- [x] 1.1 Write failing tests for the portfolio model: given asset `(μ, σ, fee)`, weights, and a correlation, compute closed-form portfolio expected return `μ_p` and volatility `σ_p`
- [x] 1.2 Implement the model helpers to pass; keep pure and dependency-free
- [x] 1.3 Add a `sharpe` helper `(μ_p − r_f) / σ_p` with tests (including the diversification effect: two assets with low correlation give `σ_p` below either alone)
- [x] 1.4 Add fee-drag and real-vs-nominal helpers (reuse the tab-1 `toReal` approach) with tests

## 2. Build Panel (the shared left column)

- [x] 2.1 Build the mix controls — per-asset weight sliders (stocks/bonds/cash/gold) that stay normalized to 100%, one global correlation dial (clamped to the PSD-valid range ρ ≥ −1/(N−1)), and a contribution plan
- [x] 2.2 Wire controls → math core → live `μ_p`, `σ_p`, and mix summary
- [x] 2.3 Add locale/currency selection (`Intl.NumberFormat`, no hard-coded symbol)
- [x] 2.4 Tests: weights normalize; changing a weight or correlation updates `μ_p`/`σ_p`

## 3. Deterministic Lenses

- [x] 3.1 **Asset personalities** lens: per-class return/volatility temperament cards, with a predict-first "guess which is which" reveal, with tests
- [x] 3.2 **Diversification** lens: show combined risk vs the weighted parts as correlation changes, with tests
- [x] 3.3 **Sharpe** lens: the current mix's risk-adjusted score, with tests
- [x] 3.4 **Fee drag** + **inflation** lens: expense-ratio erosion and the dashed real ("today's money") line over the horizon, with tests

## 4. Seeded Monte Carlo Cone

- [x] 4.1 Write failing tests for a **seeded** PRNG (mulberry32) + normal sampler (Box–Muller): same seed → same sequence
- [x] 4.2 Implement the seeded sampler; add a path sampler drawing correlated annual returns from `(μ, Σ)`, with tests (reproducible under a fixed seed; percentile ordering p10 ≤ p50 ≤ p90)
- [x] 4.3 Render the cone as SVG (p10/p50/p90 fan) from the sampled paths
- [x] 4.4 Add the **predict-first gate**: the cone stays hidden until the learner commits a guess; tests cover the gate and reproducibility

## 5. Behavior Drills

- [x] 5.1 **DCA vs lump sum** lens: two contribution schedules over one sampled/replayed path, showing the outcome gap, with tests
- [x] 5.2 **Panic drill** lens: a scripted crash path with a hold-vs-sell choice, showing the cost of selling the dip, with tests

## 6. Historical Time-Machine

- [x] 6.1 Derive and bundle a small static returns dataset (`returns.ts`) from Damodaran's `histretSP` table (annual S&P 500 / 10-yr T.Bond / 3-mo T.Bill / Gold, 1971→2024); provenance + 1971-start rationale recorded in the module header (and the lab `AGENTS.md`)
- [x] 6.2 Replay the current mix deterministically through the real series (pick a start decade), rendering the realized path, with tests

## 7. Framing & Routing

- [x] 7.1 Add a "not financial advice" disclaimer; ensure no product/mix is recommended
- [x] 7.2 Reach the sandbox from the landing "Portfolio Sandbox" card via a hash route (`#lab/portfolio-sandbox`)
- [x] 7.3 Respect `prefers-reduced-motion` across all animated lenses (reuses `.lab-curve-line`, reduced-motion aware); every lens legible without animation with an accessible key-figure summary

## 8. Verification & Docs

- [x] 8.1 Full gate green locally: lint → format check → test → build
- [x] 8.2 Add a per-directory `AGENTS.md` for the new lab directory (including dataset provenance)
- [x] 8.3 `openspec validate portfolio-sandbox` passes

## Deferred (candidate follow-ups)

The other 11 explored topics — interactive efficient-frontier plot, 1/N vs
concentration, volatility-drag lab, sequence-of-returns lab, rebalancing +
bands, tax drag / asset location, safe withdrawal / 4% rule, fat-tails vs bell
curve, risk-tolerance quiz, lazy-portfolio showdown — are out of v1 scope and
left for follow-up changes.
