import fs from "node:fs/promises";
import nodePath from "node:path";
import os from "node:os";

type DisposableDirectory = {
  path: string;
  [Symbol.asyncDispose](): Promise<void>;
};

export async function getDisposableDirectory(
  prefix: string = "disposable-directory-",
): Promise<DisposableDirectory> {
  const tempDir = await fs.mkdtemp(nodePath.join(os.tmpdir(), prefix));
  return {
    path: tempDir,
    [Symbol.asyncDispose]() {
      return fs.rm(tempDir, { recursive: true, force: true });
    },
  };
}
