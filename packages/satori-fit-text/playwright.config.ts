import {
  deriveConfig,
  type PlaywrightTestConfig,
} from "@altano/testing/playwright";

const config: PlaywrightTestConfig = deriveConfig({ port: 3717 });

export default config;
