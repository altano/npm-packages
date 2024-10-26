import { getFixtureCompiler } from "@altano/remark-plugin-test-util/testByFixture";
import { describe, vi, it, expect, beforeEach, afterEach } from "vitest";

describe("remark-mdx-toc-with-slugs", async () => {
  describe("misbehaving @altano/remark-mdx-toc", async () => {
    beforeEach(() => {
      vi.resetModules();
    });

    afterEach(() => {
      vi.doUnmock("@altano/remark-mdx-toc");
      vi.doUnmock("unist-util-visit");
      vi.resetAllMocks();
    });

    it("should error when remarkMdxToc's transform gives back garbage", async () => {
      vi.doMock("@altano/remark-mdx-toc", async () => {
        return {
          default: () => () => Promise.resolve(1),
        };
      });

      const { default: remarkMdxTocWithSlugs } = await import(
        "../../src/index.js"
      );
      const compileWithPlugin = await getFixtureCompiler(
        remarkMdxTocWithSlugs,
        "basic",
      );

      await expect(
        compileWithPlugin,
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Wasn't expected remark-mdx-toc to be an async plugin]`,
      );
    });

    it("should error when visit gives back non-mdx nodes", async () => {
      // load this first so that it uses the normal visit() internally
      await import("@altano/remark-mdx-toc");

      vi.doMock("unist-util-visit", async (importOriginal) => {
        const mod = await importOriginal<typeof import("unist-util-visit")>();
        return {
          default: mod,
          visit(
            _ast: unknown,
            _selector: unknown,
            callback: (mdxNode: unknown) => void,
          ) {
            callback({
              type: "garbage node that isn't mdxjsEsm",
            });
          },
        };
      });

      // load this after the mocking so it sees the mock
      const { default: remarkMdxTocWithSlugs } = await import(
        "../../src/index.js"
      );
      const compileWithPlugin = await getFixtureCompiler(
        remarkMdxTocWithSlugs,
        "basic",
      );

      await expect(
        compileWithPlugin,
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Node was unexpected type: garbage node that isn't mdxjsEsm]`,
      );
    });
  });
});
