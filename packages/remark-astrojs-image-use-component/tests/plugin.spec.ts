import plugin from "../src/index";
import { describe } from "vitest";
import { testByFixtures } from "@altano/remark-plugin-test-util/src/testByFixture";

describe("remark-astrojs-image-use-component", async () => {
  await testByFixtures(plugin);
});
