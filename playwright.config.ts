import { BASE_URL } from '@_config/env.config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // CI runners are slower than local dev, give tests more headroom there.
  timeout: process.env.CI ? 60_000 : 45_000,
  expect: { timeout: 10_000 },
  // Single worker: the app can't reliably handle concurrent login/register requests.
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
