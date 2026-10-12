import { describe, expect, test } from "vitest";
import path from "node:path";
import { getDisposableDirectory } from "@altano/disposable-directory";
import { createFromBundle } from "../utils/createFromBundle.js";
import { repositoryTypes } from "../../src/types.js";
import { findRootSync } from "../../src/findRootSync.js";

describe("findRootSync", async () => {
  // The files we create the repository with
  const templateDirectory = path.resolve(
    import.meta.dirname,
    "..",
    "repository-template",
  );

  for (const type of repositoryTypes) {
    test(`findRootSync (${type})`, async ({ bench }) => {
      await using tempDir = await getDisposableDirectory("test-repository-");
      await createFromBundle(type, templateDirectory, tempDir.path);

      const testFilePath = path.join(tempDir.path, "test-file.txt");
      expect(testFilePath).toBeFile();

      await bench(`findRootSync (${type})`, () => {
        const root = findRootSync(tempDir.path);
        expect(root).not.toBeNull();
        expect(root).toBeDefined();
        expect(root).toBePath(tempDir.path);
      }).run();
    });
  }
});
