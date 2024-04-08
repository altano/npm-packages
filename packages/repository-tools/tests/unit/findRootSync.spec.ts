import path from "node:path";
import { describe, expect, it } from "vitest";
import { findRootSync } from "../../src";
import { testWithRepository } from "./context-fixtures/testWithRepository";
import { repositoryTypes } from "../../src/types";

describe("findRootSync", function () {
  it("find this repository's root", () => {
    const repoRoot = path.resolve(import.meta.dirname, "..", "..", "..", "..");
    expect(findRootSync(import.meta.dirname)).toEqual(repoRoot);
  });

  it("should error if given a filename (instead of a directory)", () => {
    expect(() => {
      findRootSync(import.meta.filename);
    }).toThrow(`Given path isn't a directory`);
  });

  it("should return no repositories at the drive root", () => {
    expect(findRootSync(path.normalize("/"))).toBeNull();
  });

  describe.each(repositoryTypes)("type = %s", async (repositoryType) => {
    testWithRepository(
      `should return the root dir given the root dir`,
      async ({ repository }) => {
        const { directory } = await repository({ type: repositoryType });
        expect(findRootSync(directory)).toBePath(directory);
      },
    );

    testWithRepository(
      `should return the root dir given a subdirectory`,
      async ({ repository }) => {
        const { directory } = await repository({ type: repositoryType });
        expect(findRootSync(directory)).toBePath(directory);
      },
    );

    testWithRepository(
      `should return the root dir given a deeply nested subdirectory`,
      async ({ repository }) => {
        const { directory } = await repository({ type: repositoryType });
        expect(findRootSync(directory)).toBePath(directory);
      },
    );

    testWithRepository(
      `should return the root dir given a directory that exists but is not yet committed`,
      async ({ repository }) => {
        const { directory } = await repository({ type: repositoryType });
        expect(findRootSync(directory)).toBePath(directory);
      },
    );
  });
});
