# vitest-plugins

[![npm](https://badgen.net/npm/v/@altano/vitest-plugins)](https://www.npmjs.com/package/@altano/vitest-plugins) ![Typed with TypeScript](https://badgen.net/npm/types/@altano/vitest-plugins) ![ESM only](https://badgen.net/badge/module/esm%20only?icon=js)

Custom matchers and snapshot serializers to enhance vitest.

# Installation

```
npm install -D @altano/vitest-plugins
```

## To install the custom matchers

Modify vite.config.ts / vitest.config.ts:

```ts
export default defineConfig({
  test: {
    setupFiles: [
      "@altano/vitest-plugins/matchers",
      // ...
    ],
    // ...
  },
});
```

Add matcher types to your tsconfig.json (if using TypeScript):

```json
{
  "compilerOptions": {
    "types": ["@altano/vitest-plugins/matchers"]
  }
}
```

## To install the snapshot serializers

Modify vite.config.ts / vitest.config.ts:

```ts
export default defineConfig({
  test: {
    setupFiles: [
      "@altano/vitest-plugins/serializers",
      // ...
    ],
    // ...
  },
});
```

NOTE: You can pick and choose what to install: the matchers and serializers don't depend on each other.

# Details

## Snapshot Serializers

### VFile

Will format the contents of a [vfile](https://unifiedjs.com/explore/package/vfile/) using Prettier (auto-detecting the type from the vfile's filename), e.g.

```snap
FormattedVFile {
  "cwd": "<cwd>",
  "data": {},
  "history": [
    "tests/unit/__fixtures__/basic/input.js",
  ],
  "map": undefined,
  "messages": [],
  "value": "function face() { }"
}
```

### Absolute Paths

Will replace any instances of `process.cwd()` with `<cwd>` in the snapshot. Useful when serializing strings that contain absolute paths, since those will be different on other machines running the tests.

### URLs

Will replace any instances of `http://localhost:1234` with `http://localhost` in the snapshot. Useful when dealing with test servers that use random ports.

### HTML

HTML is prettier formatted. Only works on well-formed HTML that starts with `<html` or `<!doctype`. To avoid infinitely reformatting the HTML, it is preprended with `<!-- Formatted HTML -->`.

## Matchers

Vitest's error matchers let you match against the error message, but not the rest of the Error object:

- `toThrow(error?)` - error is thrown ([docs](https://jestjs.io/docs/expect#tothrowerror))
- `toThrowErrorMatching[Inline]Snapshot` - an error _exactly_ matches a snapshot ([docs](https://jestjs.io/docs/expect#tothrowerrormatchingsnapshothint))

If you want to assert anything more complicated (e.g. an error contains some substring in the stack) then you'll need these custom matchers:

### toMatchError

Verify any part of an error object (e.g. the stack):

```ts
expect(new Error("face")).toMatchError(
  expect.objectContaining({
    stack: expect.stringContaining("readme.spec.ts"),
  }),
);
```

### toThrowErrorMatching

Verify any part of a _thrown_ error object (e.g. the stack):

```ts
expect(() => {
  throw new Error("face");
}).toThrowErrorMatching(
  expect.objectContaining({
    stack: expect.stringContaining("readme.spec.ts"),
  }),
);
```

### toBePath

Verify the realpath (canonical path) of expected. More lenient than a string check when dealing with logical paths, symlinks, etc.

```ts
expect("/private/some/path").toBePath("/some/path");
```

### toBeFile

Verify a file exists (on the filesystem)

```ts
expect(import.meta.filename).toBeFile();
```

### toBeDirectory

Verify a directory exists (on the filesystem)

```ts
expect("/").toBeDirectory();
```

### toEqualFile

Verify that the contents of a file at a given path match the contents of a file at a another path

```ts
expect("/some/file.txt").toEqualFile("/other/file.txt");
```

### toHaveExifProperty

Similar to the `toHaveProperty` matcher, but checks exif properties on the given buffer (or any object parseable by the `exifr` library).

### toHaveHeader (on Response objects)

Verify that Response has an expected header and optional value

### toHaveStatus (on Response objects)

Verify that a Response has an expected status code
