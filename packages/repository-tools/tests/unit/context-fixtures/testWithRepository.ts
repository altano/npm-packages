import { test, type TestAPI } from "vitest";
import { getDisposableDirectory } from "../../utils/getDisposableDirectory";
import { createFromBundle } from "../../utils/createFromBundle";
import path from "node:path";

type RepositoryOptions =
  | { type: "git" }
  | { type: "mercurial" }
  | { type: "sapling" }
  | { type: "subversion" };

type RepositoryFixture = {
  repository(options: RepositoryOptions): Promise<{ directory: string }>;
};

// TODO: consider moving this into vitest-plugins

/**
 * test with a temporary, version-controlled repository
 */
export const testWithRepository: TestAPI<RepositoryFixture> = test.extend({
  // eslint-disable-next-line no-empty-pattern
  async repository({}, use) {
    // The files we create the repository with
    const templateDirectory = path.resolve(
      import.meta.dirname,
      "..",
      "..",
      "repository-template",
    );
    await using tempDir = await getDisposableDirectory("test-repository-");

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(async (options: RepositoryOptions) => {
      await createFromBundle(options.type, templateDirectory, tempDir.path);

      return { directory: tempDir.path };
    });

    // tempDir will get automatically cleaned up as the test exits.
  },
});
