import { describe, expect, it } from "vitest";
import {
  repositoryExec,
  repositoryExecSync,
} from "../../src/repositoryCommand";
import { testWithRepository } from "./context-fixtures/testWithRepository";

describe("repositoryCommand", () => {
  describe("asynchronous", () => {
    it("should reject with error", async () => {
      await expect(async () => {
        await repositoryExec(import.meta.dirname, "git", ["face"]);
      }).rejects.toThrow(/Command failed/);
    });
    testWithRepository(
      "should reject with error when 0 exit code but stderr is not empty",
      async ({ repository }) => {
        const { directory } = await repository({ type: "git" });
        await expect(async () => {
          // `git add` with nothing specified has a 0 exit code but shows a hint on stderr
          await repositoryExec(directory, "git", ["add"]);
        }).rejects.toThrow(/Nothing specified, nothing added/);
      },
    );
  });
  describe("synchronous", () => {
    it("should reject with errors", () => {
      expect(() => {
        repositoryExecSync(import.meta.dirname, "git", ["face"]);
      }).toThrow(/Command failed/);
    });
  });
});
