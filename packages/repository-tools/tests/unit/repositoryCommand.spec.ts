import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
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
  describe("environment", () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    testWithRepository(
      "should not let an inherited GIT_DIR pin git to another repository (issue #299)",
      async ({ repository }) => {
        const { directory } = await repository({ type: "git" });
        const subdirectory = path.join(directory, "subdirectory");

        // What git exports when it runs a hook in a normal (non-worktree)
        // checkout. Git resolves it against the cwd of the command we run, so
        // from a subdirectory it points at a .git that isn't there.
        vi.stubEnv("GIT_DIR", ".git");

        const showToplevel = ["rev-parse", "--show-toplevel"];
        expect(repositoryExecSync(subdirectory, "git", showToplevel)).toBePath(
          directory,
        );
        await expect(
          repositoryExec(subdirectory, "git", showToplevel),
        ).resolves.toBePath(directory);
      },
    );
  });
});
