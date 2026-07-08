# rolnopolTests

Playwright test framework for [Rolnopol](https://github.com/jaktestowac/rolnopol), a farming management app.

## Setup

1. Clone and run the Rolnopol app separately (`npm start`, defaults to `http://localhost:3000`).
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and adjust `BASE_URL` if needed.

## Running tests

```bash
npm test              # run all tests
npm run test:ui       # UI tests only
npm run test:api      # API tests only
npm run test:report   # open the last HTML report
```

## Project structure

- `src/api` - API requests, fixtures, factories and models used by both API and UI tests.
- `src/ui` - Page Object Model (pages and components) and UI-specific fixtures/helpers.
- `src/merge.fixture.ts` - combined fixture set used by most tests.
- `tests/api`, `tests/ui/end-to-end`, `tests/ui/integration` - the actual test specs.
- `docs/test-scenarios` - test scenarios (TC-XXX), written before the corresponding test was implemented.

## Test tagging

Each test carries a `@TC-XXX` tag plus one layer tag (`@UI`, `@API` or `@INTEGRATION`), based on what it actually asserts on. Tags are used to split work into per-layer PRs and to filter runs, e.g. `npx playwright test --grep @API`.

## CI

Every push and pull request to `main` runs two GitHub Actions workflows: Playwright tests (against a freshly started Rolnopol app) and linters (lint, format check, typecheck). See `.github/workflows`.

## Known app bugs found by these tests

- Marketplace purchases never actually update either party's balance (`TC-006`, marked with `test.fail()`).
- The app reuses numeric user/animal IDs after deletion, which can make a new user inherit another, already-deleted user's still-active marketplace offer (`TC-002`, skipped with a note).
