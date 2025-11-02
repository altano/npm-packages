import { describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import { getDisposableDirectory } from "../../src/index.js";

async function doesDirectoryExist(dirPath: string): Promise<boolean> {
  try {
    await fs.access(dirPath);
  } catch (error) {
    return false;
  }

  return true;
}

describe("getDisposableDirectory", () => {
  it("should create a directory", async () => {
    await using tempDir = await getDisposableDirectory("prefix");
    await expect(doesDirectoryExist(tempDir.path)).resolves.toBeTruthy();
  });

  it("should not require the prefix", async () => {
    await using tempDir = await getDisposableDirectory();
    await expect(doesDirectoryExist(tempDir.path)).resolves.toBeTruthy();
  });

  it("should use the prefix in the directory name", async () => {
    await using tempDir = await getDisposableDirectory("face-");
    expect(tempDir.path).toMatch(/\bface\b/);
  });

  it("should clean up the directory after the function exits", async () => {
    async function doSomethingWithDir(): Promise<string> {
      await using tempDir = await getDisposableDirectory();
      await expect(doesDirectoryExist(tempDir.path)).resolves.toBeTruthy();
      return tempDir.path;
    }

    const tempDirPath = await doSomethingWithDir();
    await expect(doesDirectoryExist(tempDirPath)).resolves.toBeFalsy();
  });

  it("should clean up the directory after an exception is thrown", async () => {
    const asyncExpect = Promise.withResolvers<void>();
    async function doSomethingWithDir(): Promise<string> {
      await using tempDir = await getDisposableDirectory();

      // exists now ...
      await expect(doesDirectoryExist(tempDir.path)).resolves.toBeTruthy();

      // queue up the expect. wait 500ms. I don't really know how to do better.
      setTimeout(() => {
        void (async () => {
          try {
            // but is disposed of by the time we reach here
            await expect(doesDirectoryExist(tempDir.path)).resolves.toBeFalsy();
          } finally {
            asyncExpect.resolve();
          }
        })();
      }, 500);

      throw new Error(`I'm a computer, stop all the downloading`);
    }

    await expect(doSomethingWithDir).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: I'm a computer, stop all the downloading]`,
    );
    await asyncExpect.promise; // explicitly await on the setImmediate and expect to complete.
  });
});
