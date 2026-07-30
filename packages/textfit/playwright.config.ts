import {
  deriveConfig,
  type PlaywrightTestConfig,
} from "@altano/testing/playwright";

const config: PlaywrightTestConfig = deriveConfig({ port: 8173 });

export default config;
