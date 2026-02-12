// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const os = require('os');
const path = require('path');

/**
 * Playwright configuration for ByteCast workspace tests
 * @see https://playwright.dev/docs/test-configuration
 */
const allBrowsers = String(process.env.BYTECAST_ALL_BROWSERS || "").trim() === "1";
const outputDir = process.env.BYTECAST_PW_OUTPUT_DIR
  ? String(process.env.BYTECAST_PW_OUTPUT_DIR)
  : path.join(os.tmpdir(), 'bytecast-test-results');
const reportDir = process.env.BYTECAST_PW_REPORT_DIR
  ? String(process.env.BYTECAST_PW_REPORT_DIR)
  : path.join(os.tmpdir(), 'bytecast-playwright-report');

module.exports = defineConfig({
  testDir: './tests',
  // Guardrail: SMB/network shares can flake when parallel workers/artifacts write into the repo.
  // Default to stable local-temp artifacts + single worker. Override via env vars if desired.
  outputDir,
  /* Run tests in files in parallel */
  fullyParallel: String(process.env.BYTECAST_PW_FULLY_PARALLEL || "").trim() === "1",
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : (Number(process.env.BYTECAST_PW_RETRIES || "0") || 0),
  /* Workers: stable default (1), override with BYTECAST_PW_WORKERS */
  workers: Number(process.env.BYTECAST_PW_WORKERS || (process.env.CI ? "1" : "1")),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { outputFolder: reportDir, open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BYTECAST_URL || 'http://localhost:8080',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ...(allBrowsers ? [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }] : []),
    ...(allBrowsers ? [{ name: 'webkit', use: { ...devices['Desktop Safari'] } }] : []),
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'python -m http.server 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
