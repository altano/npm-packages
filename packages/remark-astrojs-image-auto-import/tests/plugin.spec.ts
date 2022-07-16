import plugin from "../src/index";
import { describe } from "vitest";
import { testByFixtures } from "@altano/remark-plugin-test-util/src/testByFixture";

describe("remark-astrojs-image-auto-import", async () => {
  await testByFixtures(plugin);
});
