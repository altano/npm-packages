import { describe, expect, bench } from "vitest";
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
    // create the repository
    //
    // NOTE: We're intentionally not using `using` to get scope-based cleanup.
    // That's because `bench` will collect all the async callbacks and run them
    // after the `using` finalization.
    //
    // NOTE: This (intentionally) NEVER gets cleaned up, because vitest gives us
    // no hook to run cleanup after all `bench` tests run (`beforeAll` and
    // `afterAll` are not supported with `bench`). Redo this when `beforeAll` is
    // supported with `bench`:
    //
    //   1. Move the code below into a `beforeAll` function above
    //   2. In `beforeAll` we can return an async callback that does the cleanup
    const tempDir = await getDisposableDirectory("test-repository-");
    await createFromBundle(type, templateDirectory, tempDir.path);

    // assert file exists
    const testFilePath = path.join(tempDir.path, "test-file.txt");
    expect(testFilePath).toBeFile();

    bench(`findRootSync (${type})`, () => {
      const root = findRootSync(tempDir.path);
      expect(root).not.toBeNull();
      expect(root).toBeDefined();
      expect(root).toBePath(tempDir.path);
    });
  }
});
