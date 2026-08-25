## ADDED Requirements

### Requirement: Sandbox core with live compounding controls

The lab SHALL provide an interactive sandbox where the learner adjusts the
inputs of a compounding scenario and sees the projected balance update.

#### Scenario: Controls drive the projection

- **WHEN** the learner changes any of principal, monthly contribution, interest
  rate, number of years, or compounding frequency
- **THEN** the projected future balance and its growth curve update to reflect
  the new inputs

#### Scenario: No default interest rate is assumed

- **WHEN** the sandbox first loads
- **THEN** no interest rate is pre-selected as an expected or recommended return,
  and the learner must choose a rate before a projection is shown

#### Scenario: Compounding is deterministic and closed-form

- **WHEN** the same set of inputs is entered twice
- **THEN** the projected balance is identical each time (no randomness)

#### Scenario: Contribution and growth are broken out

- **WHEN** a projection is shown
- **THEN** the projected balance, the total the learner contributes, and the
  amount added by growth are each displayed

### Requirement: Inflation-adjusted (real vs nominal) view

The lab SHALL show the projection in today's money alongside the nominal figure,
driven by an inflation control.

#### Scenario: Real value is shown and responds to inflation

- **WHEN** the learner changes the inflation input
- **THEN** the "worth today" (real) value and its dashed curve line update to
  discount the nominal balance by the chosen inflation rate

#### Scenario: Real equals nominal at zero inflation

- **WHEN** the inflation input is zero
- **THEN** the real value matches the nominal projected balance

### Requirement: Animated growing curve

The lab SHALL render the projected balance over time as a growing curve, with a
dashed real (inflation-adjusted) line alongside the nominal one.

#### Scenario: Curve reflects current inputs

- **WHEN** the projection is displayed
- **THEN** a nominal curve and a dashed real curve of balance against time are
  shown for the selected time horizon

#### Scenario: Motion-safe presentation

- **WHEN** the user's system requests reduced motion
- **THEN** the curve animation is disabled while the curve and its values remain
  fully legible

### Requirement: Locale-flexible currency presentation

The lab SHALL present monetary values using a selectable locale and currency
rather than a hard-coded currency symbol.

#### Scenario: Currency follows the selected locale

- **WHEN** a locale/currency is selected
- **THEN** all monetary values are formatted according to that locale and currency

### Requirement: Not-financial-advice disclaimer

The lab SHALL display a clear disclaimer that it is educational and not
financial advice, and SHALL NOT recommend financial products or a specific
expected return.

#### Scenario: Disclaimer is present

- **WHEN** the lab is displayed
- **THEN** a visible "not financial advice" disclaimer is shown and no financial
  product is recommended
