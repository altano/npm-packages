import { describe, expect, it } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";

const execFileAsync = promisify(execFile);
const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

/**
 * Guards against a module-resolution bug in the *published* output. There was
 * one: `import { groupBy } from "lodash"` type-checked, bundled, and passed
 * every test, but threw for any real consumer:
 *
 *   SyntaxError: Named export 'groupBy' not found. The requested module
 *   'lodash' is a CommonJS module, which may not support all module.exports as
 *   named exports.
 *
 * Node detects a CJS module's named exports statically (cjs-module-lexer), and
 * lodash builds `module.exports` at runtime, so nothing is detectable.
 *
 * This has to spawn a real node. Importing the package by name from a test —
 * `import { cdnify } from "@altano/html-cdnify"` — resolves through `exports`
 * to the same built file, but vitest's module runner applies its own CJS
 * interop and imports it happily. That was measured, not assumed: with the
 * lodash bug reintroduced and dist rebuilt, the by-name import still passed
 * while the spawn below failed with the error above.
 */
describe("published output", () => {
  it("can be imported by node as ESM", async () => {
    const { stdout } = await execFileAsync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `const m = await import("./dist/index.js");
         console.log(Object.keys(m).sort().join(","));`,
      ],
      { cwd: packageRoot },
    );

    expect(stdout.trim()).toEqual("CDNTransformer,cdnify");
  });
});
