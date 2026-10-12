import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  defineConfig,
  devices,
  type LaunchOptions,
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

/**
 * On macOS 27, Firefox can't read `~/Library/Application Support/Firefox` when
 * it is started from a terminal that lacks full disk access, so it exits with
 * "Could not find profile folder" (or hangs, on older builds). Every Firefox
 * build uses that directory even when Playwright passes `-profile`.
 * `MOZ_APP_DATA` moves it somewhere Firefox can read, and the profile itself
 * still lives in Playwright's own temporary directory.
 */
const firefoxEnv = (): Record<string, string> => {
  if (process.platform !== "darwin") {
    return {};
  }
  const appData = join(tmpdir(), "playwright-firefox-app-data");
  mkdirSync(appData, { recursive: true });
  return { MOZ_APP_DATA: appData };
};

/** `projectUse.firefox` with `firefoxEnv` merged into its launch options. */
const withFirefoxEnv = (
  use: ProjectUse & { launchOptions?: LaunchOptions } = {},
): ProjectUse => ({
  ...use,
  launchOptions: {
    ...use.launchOptions,
    env: { ...process.env, ...firefoxEnv(), ...use.launchOptions?.env },
  },
});

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
          use: {
            ...devices["Desktop Firefox"],
            ...withFirefoxEnv(projectUse.firefox),
          },
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
