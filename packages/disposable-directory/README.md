# disposable-directory

[![npm](https://badgen.net/npm/v/@altano/disposable-directory)](https://www.npmjs.com/package/@altano/disposable-directory) ![Typed with TypeScript](https://badgen.net/npm/types/@altano/disposable-directory) ![ESM only](https://badgen.net/badge/module/esm%20only?icon=js)

Simple utility for getting a disposable, temporary directory in a Node.js-compatible environment. Directory is cleaned up automatically when the function scope exists.

Uses the new `Symbol.asyncDispose` API and therefore requires Node.js 24+.

## Example

```ts
async function doSomething() {
  // This creates a directory
  await using tempDir = await getDisposableDirectory();

  // the directory exists for the scope of this function
  console.log(tempDir);

  // No cleanup is required. The directory will implicitly be deleted when this function exits (or throws an error).
}
```
