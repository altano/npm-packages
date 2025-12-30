import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const baseURL = "http://localhost:4727";
const isCI = !!process.env["CI"];

const scuffedViewport = isCI
  ? {
      // viewport is busted in CI (800x450 instead of 1280x720) so just manually
      // increase the viewport by 1.6 in CI so that it's correct. I couldn't find
      // any github issues and didn't feel like filing one so here we are.
      width: 1280 * 1.6,
      height: 720 * 1.6,
    }
  : {
      width: 1280,
      height: 720,
    };

const projects = {
  chromium: {
    name: "chromium",
    use: { ...devices["Desktop Chrome"] },
  },
  firefox: {
    name: "firefox",
    use: { ...devices["Desktop Firefox"], viewport: scuffedViewport },
  },
  webkit: {
    name: "webkit",
    use: { ...devices["Desktop Safari"], viewport: scuffedViewport },
  },
  mobileChrome: {
    name: "Mobile Chrome",
    use: { ...devices["Pixel 5"] },
  },
  mobileSafari: {
    name: "Mobile Safari",
    use: { ...devices["iPhone 12"] },
  },
  edge: {
    name: "Microsoft Edge",
    use: { ...devices["Desktop Edge"], channel: "msedge" },
  },
  chrome: {
    name: "Google Chrome",
    use: { ...devices["Desktop Chrome"], channel: "chrome" },
  },
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = defineConfig({
  testDir: "./tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  maxFailures: isCI ? 1 : 0,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  ...(isCI ? { workers: 1 } : undefined),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { open: "never" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    // Use a consistent viewport since the tests hard-code what is on screen
    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for major browsers */
  projects: [
    projects.chromium,
    projects.firefox,
    projects.webkit,

    /* Test against mobile viewports. */
    // projects.mobileChrome,
    // projects.mobileSafari,

    /* Test against branded browsers. */
    // projects.edge,
    // projects.chrome,
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm run test:e2e:server",
    url: baseURL,
    reuseExistingServer: false,
  },
});

export default config;
