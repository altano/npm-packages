import plugin from "../../src/index.js";
import { describe } from "vitest";
import { testByFixtures } from "@altano/remark-plugin-test-util/testByFixture";

describe("remark-mdx-toc", async () => {
  await testByFixtures(plugin);
});
