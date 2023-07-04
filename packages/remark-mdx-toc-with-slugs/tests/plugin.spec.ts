import plugin from "../src/index";
import { describe } from "vitest";
import { testByFixtures } from "@altano/remark-plugin-test-util/src/testByFixture";

describe("remark-mdx-toc-with-slugs", async () => {
  await testByFixtures(plugin);
});
