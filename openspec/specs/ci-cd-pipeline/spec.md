# ci-cd-pipeline Specification

## Purpose
TBD - created by archiving change scaffold-spa-foundation. Update Purpose after archive.
## Requirements
### Requirement: Continuous integration quality gate

The project SHALL run a CI gate on every pull request and push to `main` that
installs with a frozen lockfile and runs audit, lint, format check, tests, and
build. Any failing step MUST fail the gate.

#### Scenario: Gate runs the full quality sequence

- **WHEN** a pull request targets `main`
- **THEN** CI runs install (frozen lockfile) → audit → lint → format check → test → build, and fails if any step fails

#### Scenario: Dependency audit blocks high-severity vulnerabilities

- **WHEN** the audit step finds a vulnerability at high severity or above
- **THEN** the gate fails

### Requirement: Deploy to GitHub Pages on main

The project SHALL publish the production build to GitHub Pages only after the
gate passes on `main`, serving the app under the `/finsight/` base path.

#### Scenario: Successful main build deploys

- **WHEN** the gate passes on a push to `main`
- **THEN** the `dist/` output is published to GitHub Pages via the Actions deployment

#### Scenario: Non-main branches do not deploy

- **WHEN** the gate passes on a pull request or non-`main` branch
- **THEN** no GitHub Pages deployment occurs

#### Scenario: Client-side routing fallback exists

- **WHEN** the site is built for deployment
- **THEN** a `404.html` fallback copy of `index.html` is included so deep links resolve on Pages

