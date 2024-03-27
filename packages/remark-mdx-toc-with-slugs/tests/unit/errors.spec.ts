import { getFixtureCompiler } from "@altano/remark-plugin-test-util/testByFixture";
import { describe, vi, it, expect, beforeEach, afterEach } from "vitest";

describe("remark-mdx-toc-with-slugs", async () => {
  describe("misbehaving remark-mdx-toc plugin", async () => {
    beforeEach(() => {
      vi.resetModules();
    });

    afterEach(() => {
      vi.doUnmock("remark-mdx-toc");
      vi.doUnmock("unist-util-visit");
      vi.resetAllMocks();
    });

    it("should error when initializes to nothing", async () => {
      vi.doMock("remark-mdx-toc", async (importOriginal) => {
        const mod = await importOriginal<typeof import("remark-mdx-toc")>();
        return {
          default: mod,
          remarkMdxToc: () => {},
        };
      });

      const { default: remarkMdxTocWithSlugs } = await import("../../src");
      expect(() => {
        // @ts-expect-error testing error path
        remarkMdxTocWithSlugs.call(null, {});
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: Couldn't create mdxTocTransformer function]`,
      );
    });

    it("should error when remarkMdxToc's transform gives back garbage", async () => {
      vi.doMock("remark-mdx-toc", async (importOriginal) => {
        const mod = await importOriginal<typeof import("remark-mdx-toc")>();
        return {
          default: mod,
          remarkMdxToc: () => () => Promise.resolve(1),
        };
      });

      const { default: remarkMdxTocWithSlugs } = await import("../../src");
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

      const { default: remarkMdxTocWithSlugs } = await import("../../src");
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
