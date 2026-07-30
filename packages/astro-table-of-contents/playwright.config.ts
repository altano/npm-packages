import {
  deriveConfig,
  type PlaywrightTestConfig,
} from "@altano/testing/playwright";

const config: PlaywrightTestConfig = deriveConfig({ port: 4783 });

export default config;
