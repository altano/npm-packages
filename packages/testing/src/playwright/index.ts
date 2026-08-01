import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
  type Project,
} from "@playwright/test";

export type { PlaywrightTestConfig } from "@playwright/test";

/**
 * Whether tests are running in CI. Exported so packages that vary their config
 * by environment don't each have to read `process` themselves.
 */
export const isCI: boolean = !!process.env["CI"];

type ProjectUse = NonNullable<Project["use"]>;

/** Browsers every package tests against. */
type BrowserName = "chromium" | "firefox" | "webkit";

export interface DeriveConfigOptions {
  /**
   * Port this package's `test:e2e:server` script listens on. Every package
   * reserves a different one so suites can run at the same time.
   */
  port: number;
  /**
   * Extra `use` options merged into individual browser projects, for
   * capabilities only some packages' tests need.
   */
  projectUse?: Partial<Record<BrowserName, ProjectUse>>;
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const deriveConfig = (
  { port, projectUse = {} }: DeriveConfigOptions,
  overrides: PlaywrightTestConfig = {},
): PlaywrightTestConfig => {
  const baseURL = `http://localhost:${port}`;

  return defineConfig(
    {
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
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"], ...projectUse.chromium },
        },
        {
          name: "firefox",
          use: { ...devices["Desktop Firefox"], ...projectUse.firefox },
        },
        {
          name: "webkit",
          use: { ...devices["Desktop Safari"], ...projectUse.webkit },
        },
      ],

      /* Run your local dev server before starting the tests */
      webServer: {
        command: "pnpm run test:e2e:server",
        url: baseURL,
        reuseExistingServer: false,
        env: {
          // Astro 7 auto-detects AI agent environments (Claude Code, etc.) and
          // silently runs `astro dev` as a detached background process, which
          // breaks Playwright: the server it starts never becomes the process
          // Playwright is supervising, and a relative `--root` gets resolved a
          // second time against the child's new cwd, doubling the path. This is
          // Astro's documented opt-out; it keeps the dev server in the
          // foreground where Playwright can manage its lifecycle.
          ASTRO_DEV_BACKGROUND: "0",
        },
      },
    },
    overrides,
  );
};
