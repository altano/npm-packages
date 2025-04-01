import { describe, expect, bench } from "vitest";
import path from "node:path";
import { getDisposableDirectory } from "../utils/getDisposableDirectory.js";
import { createFromBundle } from "../utils/createFromBundle.js";
import { repositoryTypes } from "../../src/types.js";

describe("createFromBundle", async () => {
  // The files we create the repository with
  const templateDirectory = path.resolve(
    import.meta.dirname,
    "..",
    "repository-template",
  );

  for (const type of repositoryTypes) {
    bench(`createFromBundle (${type})`, async () => {
      await using tempDir = await getDisposableDirectory("test-repository-");
      await createFromBundle(type, templateDirectory, tempDir.path);
      const testFilePath = path.join(tempDir.path, "test-file.txt");
      expect(testFilePath).toBeFile();
    });
  }
});
