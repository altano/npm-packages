import { describe, expect, it } from "vitest";
import { testWithRepository } from "./context-fixtures/testWithRepository";
import path from "node:path";
import { repositoryTypes } from "../../src/types";
import { getInternalDirectory } from "../utils/getInternalDirectory";

// some basic tests of the test fixture itself
describe("testWithRepository", () => {
  it("should support multiple repository types", () => {
    expect(repositoryTypes).toHaveLength(4);
  });

  for (const type of repositoryTypes) {
    testWithRepository("should return a temp dir", async ({ repository }) => {
      const { directory } = await repository({ type });
      expect(directory).toMatch(/test-repository/);
    });

    testWithRepository(
      "temp dir should be a repository",
      async ({ repository }) => {
        const { directory } = await repository({ type });
        expect(directory).toMatch(/test-repository/);
        expect(
          path.join(directory, getInternalDirectory(type)),
        ).toBeDirectory();
      },
    );

    testWithRepository(
      "temp dir should have the template directory contents",
      async ({ repository }) => {
        const { directory } = await repository({ type });
        expect(path.join(directory, "test-file.txt")).toBeFile();
      },
    );
  }
});
