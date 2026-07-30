import {
  deriveConfig,
  isCI,
  type PlaywrightTestConfig,
} from "@altano/testing/playwright";

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

const config: PlaywrightTestConfig = deriveConfig({
  port: 4727,
  projectUse: {
    firefox: { viewport: scuffedViewport },
    webkit: { viewport: scuffedViewport },
  },
});

export default config;
