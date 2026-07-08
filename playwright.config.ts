import { BASE_URL } from '@_config/env.config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  // The target app under test persists users/sessions to JSON files on disk using
  // synchronous writes (see rolnopol/helpers/token.helpers.js: persistTokenStorage).
  // Concurrent requests can stall the single-threaded server under file contention,
  // so tests are run with a single worker to keep the suite reliable.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html'],
    ['json', { outputFile: './playwright-report/results.json' }],
    ['junit', { outputFile: './playwright-report/results.xml' }],
  ],
  use: {
    baseURL: BASE_URL,
    actionTimeout: 10_000,
    navigationTimeout: 10_000,
    testIdAttribute: 'data-testid',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
