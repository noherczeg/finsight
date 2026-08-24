## ADDED Requirements

### Requirement: Pure client-side SPA

The application SHALL be a pure single-page application rendered entirely in
the browser, with no server-side rendering or backend runtime dependency.

#### Scenario: App boots from a static host

- **WHEN** the built `dist/` output is served by any static file host
- **THEN** the app mounts React into `#root` and renders without any server process

#### Scenario: Missing mount node fails loudly

- **WHEN** the `#root` element is absent from the HTML document
- **THEN** startup throws an explicit "Root element #root not found" error

### Requirement: Modern build and language toolchain

The project SHALL build with Vite 8, use React 19 and TypeScript 7 in strict
mode, and style with Tailwind CSS 4 via the official Vite plugin.

#### Scenario: Production build succeeds

- **WHEN** `pnpm build` runs
- **THEN** TypeScript type-checks with no errors and Vite emits a production bundle to `dist/`

#### Scenario: Strict typing enforced

- **WHEN** source contains a type error or unused local/parameter
- **THEN** `pnpm build` fails the type-check step before bundling

### Requirement: Oxc lint and format toolchain

The project SHALL lint with `oxlint` and format with `oxfmt`, and formatting
MUST NOT rewrite project doctrine or tooling markdown (`AGENTS.md`, `.pi/`,
`openspec/`).

#### Scenario: Lint passes on clean source

- **WHEN** `pnpm lint` runs against conforming source
- **THEN** oxlint reports no errors

#### Scenario: Format check is scoped

- **WHEN** `pnpm format:check` runs
- **THEN** only application code and README are checked, and doctrine/tooling markdown is ignored

### Requirement: Automated test setup

The project SHALL provide a Vitest 4 + Testing Library test environment using
jsdom, runnable in a single non-watch command.

#### Scenario: Test suite runs headless

- **WHEN** `pnpm test` runs
- **THEN** Vitest executes all tests once in jsdom and exits non-zero on any failure
