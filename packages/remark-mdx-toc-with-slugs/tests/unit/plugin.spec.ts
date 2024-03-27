import plugin from "../../src";
import { describe } from "vitest";
import { testByFixtures } from "@altano/remark-plugin-test-util/testByFixture";

describe("remark-mdx-toc-with-slugs", async () => {
  await testByFixtures(plugin);
});
