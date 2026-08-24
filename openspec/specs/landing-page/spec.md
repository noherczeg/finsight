# landing-page Specification

## Purpose
TBD - created by archiving change scaffold-spa-foundation. Update Purpose after archive.
## Requirements
### Requirement: Branded finance-themed landing page

The app SHALL present a single landing page that communicates the finsight
brand and its purpose: learning finance through browser-based simulations.

#### Scenario: Hero headline is present

- **WHEN** the landing page renders
- **THEN** a level-1 heading conveying the "see the money move" hero message is displayed

#### Scenario: Primary call to action is present

- **WHEN** the landing page renders
- **THEN** a primary "Start exploring" action link is displayed

### Requirement: Scenario teasers

The landing page SHALL showcase the upcoming simulation scenarios so visitors
understand what finsight teaches.

#### Scenario: Scenario cards are listed

- **WHEN** the landing page renders
- **THEN** the "Compound Interest Lab", "Portfolio Sandbox", and "Market Crash Drills" scenarios are shown

### Requirement: Accessible, motion-safe presentation

The landing page SHALL respect user motion preferences and remain usable
without animation.

#### Scenario: Reduced motion disables the ticker animation

- **WHEN** the user's system requests reduced motion
- **THEN** the market ticker animation is disabled while its content stays visible

