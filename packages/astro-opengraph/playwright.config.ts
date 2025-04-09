import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
  type Project,
} from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const baseURL = "http://localhost:3913";
const isCI = !!process.env["CI"];

const use = {
  chrome: {
    permissions: ["clipboard-read", "clipboard-write"],
  },
  firefox: {
    launchOptions: {
      firefoxUserPrefs: {
        "dom.events.asyncClipboard.readText": true,
        "dom.events.testing.asyncClipboard": true,
      },
    },
  },
  webkit: {
    permissions: ["clipboard-read"],
  },
};

const projects = {
  chromium: {
    name: "chromium",
    use: { ...devices["Desktop Chrome"], ...use.chrome },
  },
  firefox: {
    name: "firefox",
    use: { ...devices["Desktop Firefox"], ...use.firefox },
  },
  webkit: {
    name: "webkit",
    use: { ...devices["Desktop Safari"], ...use.webkit },
  },
  mobileChrome: {
    name: "Mobile Chrome",
    use: { ...devices["Pixel 5"], ...use.chrome },
  },
  mobileSafari: {
    name: "Mobile Safari",
    use: { ...devices["iPhone 12"], ...use.webkit },
  },
  edge: {
    name: "Microsoft Edge",
    use: { ...devices["Desktop Edge"], channel: "msedge", ...use.chrome },
  },
  chrome: {
    name: "Google Chrome",
    use: { ...devices["Desktop Chrome"], channel: "chrome", ...use.chrome },
  },
} satisfies Record<string, Project>;

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
  projects: isCI
    ? [
        // we can enable firefox/webkit when they ship in the `playwright-driver`
        // nix linux derivation
        //
        // https://discourse.nixos.org/t/playwright-tests-on-multiple-browsers/41309
        projects.chromium,
      ]
    : [
        projects.chromium,
        projects.webkit, // produces `[WebServer] 17:16:28 [ERROR] [toolbar] Failed to load dev toolbar app ...` errors but passes *shrug*
        projects.firefox,
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
