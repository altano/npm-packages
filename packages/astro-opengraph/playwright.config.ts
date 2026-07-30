import {
  deriveConfig,
  type PlaywrightTestConfig,
} from "@altano/testing/playwright";

const config: PlaywrightTestConfig = deriveConfig({
  port: 3913,
  projectUse: {
    // This package's tests read from and write to the clipboard, which each
    // browser gates differently.
    chromium: {
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
  },
});

export default config;
