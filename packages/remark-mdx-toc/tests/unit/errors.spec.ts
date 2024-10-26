import { getFixtureCompiler } from "@altano/remark-plugin-test-util/testByFixture";
import { describe, vi, it, expect, beforeEach, afterEach } from "vitest";

describe("remark-mdx-toc", async () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.doUnmock("unist-util-visit");
    vi.resetAllMocks();
  });

  it("should error when visit gives back invalid nodes", async () => {
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
            type: "garbage node that isn't heading/mdxJsxFlowElement",
          });
        },
      };
    });

    const { default: remarkMdxToc } = await import("../../src/index.js");
    const compileWithPlugin = await getFixtureCompiler(remarkMdxToc, "basic");

    await expect(compileWithPlugin).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Node was unexpected type: garbage node that isn't heading/mdxJsxFlowElement]`,
    );
  });
});
