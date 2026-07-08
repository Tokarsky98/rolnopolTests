# Architecture

## Project structure

```text
rolnopolTests/
├── .github/workflows/       # CI: Playwright tests + linters
├── config/                  # Environment variable loading/validation
├── docs/test-scenarios/     # TC-XXX scenario docs, written before the test
├── src/
│   ├── api/
│   │   ├── factories/         # Random test data generators (faker)
│   │   ├── fixtures/          # Create/clean up data through the API
│   │   ├── models/            # Shared TypeScript shapes
│   │   ├── requests/          # Thin wrappers around REST endpoints
│   │   └── utils/             # API endpoint constants
│   ├── ui/
│   │   ├── pages/              # Page Object Model - full screens
│   │   ├── components/         # Page Object Model - reusable widgets
│   │   ├── fixtures/           # UI-specific setup (logged-in sessions)
│   │   ├── helpers/            # Session injection, etc.
│   │   └── routes/             # API route paths mocked from the UI layer
│   └── merge.fixture.ts      # Combines UI + API fixtures for tests
├── tests/
│   ├── api/                   # API-only specs
│   └── ui/end-to-end/         # UI specs
│       └── integration/         # UI specs asserting on mocked responses
└── playwright.config.ts
```

## Layers

- **API layer** (`src/api`) - `requests` are thin wrappers around Rolnopol's REST endpoints, `factories` generate random test data (faker-based), `fixtures` create and clean up test data (users, animals, offers) through the API, `models` are the shared TypeScript shapes.
- **UI layer** (`src/ui`) - Page Object Model split into `pages` (a full screen, e.g. `MarketplacePage`) and `components` (a piece reused across pages, e.g. `NotificationComponent`), plus UI-only `fixtures`/`helpers`.
- **Tests** (`tests/api`, `tests/ui/end-to-end`, `tests/ui/integration`) only call into these layers, they never talk to the app directly.

## Fixture composition

Fixtures are layered with Playwright's `test.extend`/`mergeTests` instead of one large fixture file: `userTest` -> `animalTest`/`marketplaceTest` -> `loginFixturesTest` -> `authenticatedUserTest`, combined per test file in `src/merge.fixture.ts`. Each fixture creates its own data via the API and deletes it again after the test - cleanup order matters here, since Rolnopol doesn't cascade deletes (an offer must be cancelled before its animal is removed, which must happen before the account is deleted).

## Authentication

UI tests never go through the login form to get a logged-in session (that's what `TC-001` is for). Instead, a user is registered via the API and its token is injected as cookies directly into the browser context (`injectSession`, see `src/ui/helpers/session.helper.ts`) - Rolnopol authenticates via cookies, not `localStorage`. This is faster and keeps UI tests focused on the behaviour they actually test.

## Test scenarios and tagging

Every test has a corresponding scenario doc in `docs/test-scenarios/TC-XXX.md`, written before the test itself. Each test carries two tags: `@TC-XXX` and one layer tag (`@UI`, `@API` or `@INTEGRATION`) for whichever layer it actually asserts on, used to filter runs (`--grep @API`) and to split work into per-layer PRs.

## Reporting

Playwright is configured with three reporters at once: HTML for local debugging, JSON for tooling, and JUnit for CI to publish a proper test report on pull requests instead of just a pass/fail check.

## Concurrency

The suite runs with a single worker (`workers: 1`), not just for CI stability - Rolnopol writes its JSON "database" to disk synchronously on every request, so concurrent login/register calls from multiple workers cause the app itself to stall.

## Design trade-offs

- **API-driven setup, UI only for what's actually under test.** Users, animals and offers are created and torn down through the API, and sessions are injected as cookies rather than logged in through the form. This makes tests faster and more stable, at the cost of the login form itself only being covered by one dedicated test (`TC-001`).
- **Layered fixtures over one shared setup file.** Composing `userTest`, `animalTest`, `marketplaceTest`, etc. with `mergeTests` means each test only pulls in the fixtures it needs, instead of paying for a large shared fixture regardless of relevance. The trade-off is an extra level of indirection to trace through when reading a new test.
- **`workers: 1` despite the slower run.** Rolnopol's synchronous file-based "database" can't handle concurrent writes reliably, so parallelism was traded for a suite that doesn't produce false failures.
- **`test.fail()` vs `test.skip()` for known bugs.** A bug that reproduces unconditionally (the balance bug) is marked with `test.fail()`, so the suite fails loudly the day it's fixed. A bug that only reproduces depending on prior test state (the ID-reuse bug) is marked with `test.skip()` instead, since `test.fail()` would itself start failing intermittently whenever the collision doesn't happen.

## Known app bugs found by these tests

The tests aren't just checking the happy path - a few were shaped around real bugs discovered by verifying behaviour against the actual app source rather than assuming it works as documented:

- **Marketplace purchases never actually move money.** `_updateFinancialBalances` compares a numeric `userId` against a stringified one, so the balance lookup silently never matches - the purchase itself succeeds (item changes hands, offer is marked sold), but no balance is ever debited or credited. `TC-006` documents this with `test.fail()`, since it's a deterministic bug that reproduces every time.
- **Deleted users/animals/offers are never cascade-deleted, and numeric IDs get recycled.** A brand-new account can inherit another, already-deleted account's leftover animal or active marketplace offer just by getting the same reused ID, which then blocks that account from creating its own offer for the same item. Unlike the balance bug, this only reproduces conditionally (it depends on how much ID churn happened before it), so `TC-002` documents it with `test.skip()` and a note instead of `test.fail()`, which would flip-flop between environments.
- **One token per user.** Logging in again invalidates the previous token for that account, which shaped how fixtures avoid unnecessary re-logins and how UI sessions are set up (see Authentication above).
