## ADDED Requirements

### Requirement: Shared asset-model sandbox

The sandbox SHALL provide one interactive model — a set of asset classes each
with an expected return, a volatility, and a fee, plus a correlation between them
— that the learner shapes via allocation weights and a contribution plan, and
that feeds every lens.

#### Scenario: Weights drive the portfolio figures

- **WHEN** the learner changes an allocation weight, the correlation, or the
  contribution plan
- **THEN** the portfolio expected return and volatility (and every open lens)
  update to reflect the new inputs

#### Scenario: Weights stay normalized

- **WHEN** the learner sets the allocation weights
- **THEN** the weights are treated as summing to 100% (a mix), and the displayed
  portfolio figures reflect that normalized mix

#### Scenario: No recommended mix is assumed

- **WHEN** the sandbox first loads
- **THEN** no allocation is presented as an expected or recommended portfolio,
  and the learner sets the mix themselves

### Requirement: Diversification effect

The sandbox SHALL let the learner feel that combining assets can reduce risk
below that of the individual holdings, driven by a correlation control.

#### Scenario: Lower correlation reduces portfolio risk

- **WHEN** the learner lowers the correlation between assets while holding the
  weights and per-asset volatilities fixed
- **THEN** the portfolio volatility decreases, and the lens shows the combined
  risk sitting below the weighted average of the parts

#### Scenario: Perfect correlation removes the benefit

- **WHEN** the correlation is set to its maximum (perfectly correlated)
- **THEN** the portfolio volatility equals the weighted average of the parts,
  showing no diversification benefit

### Requirement: Risk-adjusted (Sharpe) score

The sandbox SHALL show a risk-adjusted score for the current mix so the learner
can compare portfolios by reward per unit of risk.

#### Scenario: Score reflects the current mix

- **WHEN** a mix is set and a risk-free rate is available
- **THEN** the lens shows `(expected return − risk-free) / volatility` for the
  current portfolio and updates as the mix changes

### Requirement: Fee-drag and inflation (real vs nominal) lens

The sandbox SHALL show how expense-ratio fees erode outcomes and SHALL show the
projection in today's money alongside the nominal figure.

#### Scenario: Fees reduce the projected outcome

- **WHEN** the learner increases the portfolio's blended fee
- **THEN** the projected outcome decreases relative to the zero-fee case, and the
  erosion is shown

#### Scenario: Real value responds to inflation

- **WHEN** the learner changes the inflation input
- **THEN** the "worth today" (real) value and its dashed curve line update to
  discount the nominal figure by the chosen inflation rate

#### Scenario: Real equals nominal at zero inflation

- **WHEN** the inflation input is zero
- **THEN** the real value matches the nominal projected outcome

### Requirement: Seeded Monte Carlo cone

The sandbox SHALL simulate many possible futures for the current mix and present
them as an outcome cone, using a seeded pseudo-random generator so results are
reproducible.

#### Scenario: Cone reflects the current mix

- **WHEN** the Monte Carlo lens is shown for a mix
- **THEN** a cone of outcomes with low/median/high percentile bands (e.g.
  p10/p50/p90) is rendered from the simulated paths

#### Scenario: Simulation is reproducible under a fixed seed

- **WHEN** the same mix is simulated twice with the same seed
- **THEN** the resulting cone (its percentile bands) is identical each time

#### Scenario: Percentile bands are ordered

- **WHEN** the cone is computed
- **THEN** at every time step the low band is less than or equal to the median,
  which is less than or equal to the high band

### Requirement: Predict-first gate on the cone

The sandbox SHALL require the learner to commit a prediction before the Monte
Carlo cone is revealed.

#### Scenario: Cone is gated behind a prediction

- **WHEN** the Monte Carlo lens first loads for a mix
- **THEN** the cone is hidden until the learner commits a guess about where they
  will land, after which the cone and the learner's guess are shown together

### Requirement: Behavior drills

The sandbox SHALL let the learner feel the outcome of common behavioral choices:
contribution timing and reacting to a downturn.

#### Scenario: DCA vs lump sum over one path

- **WHEN** the learner compares dollar-cost averaging against a lump sum on the
  same return path
- **THEN** both resulting outcomes are shown so the learner can see the gap

#### Scenario: Selling the dip locks in the loss

- **WHEN** a scripted downturn occurs and the learner chooses to sell rather than
  hold
- **THEN** the drill shows the realized loss versus the outcome of staying
  invested through the recovery

### Requirement: Historical time-machine

The sandbox SHALL replay the current mix through real historical returns from a
bundled static dataset, deterministically.

#### Scenario: Mix is replayed through real history

- **WHEN** the learner selects a historical start period for the current mix
- **THEN** the realized path of that mix through the bundled historical returns
  is shown

#### Scenario: Historical replay is deterministic

- **WHEN** the same mix and start period are replayed twice
- **THEN** the realized path is identical each time (no randomness; data replay)

### Requirement: Deterministic, dependency-free, honest framing

The sandbox SHALL run entirely client-side with no new runtime dependencies, and
SHALL present itself honestly as an educational simulation.

#### Scenario: No network and no new runtime dependency

- **WHEN** the sandbox runs
- **THEN** all computation is client-side, the historical dataset is a bundled
  static asset (no network request), and no new runtime dependency is required

#### Scenario: Not financial advice

- **WHEN** the sandbox is shown
- **THEN** a "not financial advice" disclaimer is present, and no product or
  specific allocation is recommended

#### Scenario: Locale-flexible currency

- **WHEN** monetary figures are displayed
- **THEN** they are formatted for a selectable locale/currency with no
  hard-coded currency symbol

#### Scenario: Motion-safe presentation

- **WHEN** the learner prefers reduced motion
- **THEN** every lens is fully legible without animation, with an accessible text
  summary of its key figure
