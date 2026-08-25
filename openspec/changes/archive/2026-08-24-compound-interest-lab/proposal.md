## Why

The landing page already teases a **Compound Interest Lab**, but nothing backs
it yet. It is finsight's first real simulation — the flagship that proves the
"learn finance through browser-based simulation" premise.

The lab exists to make **exponential growth visible**. People mentally
*linearize* compounding and badly underestimate it — a well-documented bias
(Stango & Zinman, *J. Finance* 2009; *Misunderstanding Savings Growth*, *JMR*
2011). The v1 lab meets that head-on with an honest, hands-on sandbox: move the
sliders, watch the curve bend away from a straight line.

> Scope note: an earlier draft layered a guided five-act narrative (predict /
> reveal, two-savers, fees, debt, plan) on top of the sandbox. That narrative
> was cut — v1 is the **pure parameter sandbox** only. The narrative acts remain
> a candidate for a later change.

## What Changes

- Add a **Compound Interest Lab**: an interactive sandbox reached from the
  landing "Compound Interest Lab" card.
- **Sliders** for principal, monthly contribution, interest rate, years,
  inflation, and compounding frequency, driving one **animated growing curve**.
- **Real vs nominal** — a dashed "today's money" line on the curve and a "worth
  today" figure, discounting the nominal balance by the chosen inflation rate.
- **Live results** — the projected balance, its real value, the total
  contributed, and the amount added by growth, updating as the learner moves any
  slider.
- **No default rate** (the learner must choose one), **deterministic** returns,
  **locale-flexible** currency, and a **"not financial advice"** disclaimer.

## Capabilities

### New Capabilities
- `compound-interest-lab`: the interactive lab — sandbox core, the five-act
  guided spine, the predict/reveal/reflect loop, and its content/behavior
  contract.

### Modified Capabilities
<!-- None — the landing page already lists the lab as a teaser; this change
     realizes it without altering the landing-page contract. -->

## Impact

- **New code**: a lab feature under `src/` (React components for the sandbox
  controls and the SVG curve), pure compounding math helpers, and tests.
- **Routing**: introduces a first client route/view beyond the landing page
  (the landing "Compound Interest Lab" card reaches it via a hash route).
- **Dependencies**: zero new runtime deps — compounding is closed-form and the
  curve is plain SVG.
- **Out of scope (v1)**: the guided narrative acts (predict/reveal, two-savers,
  fees, debt, plan), variable/random returns, Monte Carlo, taxes,
  withdrawals/drawdown, multiple accounts.
- **Docs**: a per-directory `AGENTS.md` for the new lab directory.
