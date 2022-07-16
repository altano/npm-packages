import { compile } from "@mdx-js/mdx";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import { VFile } from "vfile";

import type { Plugin } from "unified";

async function getJSONContents(path: string): Promise<null | JSON> {
  const contents = await getFileContents(path);
  if (contents != null) {
    return JSON.parse(contents);
  }
  return null;
}

async function getFileContents(path: string): Promise<null | string> {
  try {
    const buffer = await fs.readFile(path);
    return buffer.toString();
  } catch {
    return null;
  }
}

function isTodo(fixture: string): boolean {
  return fixture.startsWith("todo-");
}

function isError(fixture: string): boolean {
  return fixture.startsWith("error-");
}

export async function testByFixtures(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugin: Plugin<any, any>,
): Promise<void> {
  const fixtures = await fs.readdir("tests/__fixtures__");
  fixtures.filter(isTodo).forEach((f) => test.todo(f));
  const rest = fixtures.filter((f) => !isTodo(f));
  test.each(rest)("[test #%#] %s", async (fixture) => {
    const fixtureDir = join("tests", "__fixtures__", fixture);
    const inputMdx = await fs.readFile(join(fixtureDir, "input.mdx"));
    const inputMdxPath = join(fixtureDir, `input.mdx`);
    const options = await getJSONContents(join(fixtureDir, "options.json"));
    const compileWithPlugin = async (): Promise<VFile> =>
      compile(new VFile({ path: inputMdxPath, value: inputMdx }), {
        format: "mdx",
        remarkPlugins: [[plugin, options]],
        jsx: true,
      });
    if (isError(fixture)) {
      await expect(compileWithPlugin).rejects.toThrowErrorMatchingSnapshot();
    } else {
      const vfile = await compileWithPlugin();
      expect(vfile).toMatchSnapshot();
    }
  });
}
