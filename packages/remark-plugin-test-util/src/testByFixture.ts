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
  const fixturesDir = join("tests", "unit", "__fixtures__");
  const fixtures = await fs.readdir(fixturesDir);
  fixtures.filter(isTodo).forEach((f) => test.todo(f));
  const rest = fixtures.filter((f) => !isTodo(f));
  test.each(rest)("[test #%#] %s", async (fixture) => {
    const compileWithPlugin = await getFixtureCompiler(plugin, fixture);
    if (isError(fixture)) {
      await expect(compileWithPlugin).rejects.toThrowErrorMatchingSnapshot();
    } else {
      const vfile = await compileWithPlugin();
      expect(vfile).toMatchSnapshot();
    }
  });
}

export async function getFixtureCompiler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugin: Plugin<any, any>,
  fixture: string,
): Promise<() => Promise<VFile>> {
  const fixturesDir = join("tests", "unit", "__fixtures__");
  const fixtureDir = join(fixturesDir, fixture);
  const inputMdx = await fs.readFile(join(fixtureDir, "input.mdx"));
  const inputMdxPath = join(fixtureDir, `input.mdx`);
  const options = await getJSONContents(join(fixtureDir, "options.json"));
  const compileWithPlugin = async (): Promise<VFile> => {
    const result = await compile(
      new VFile({ path: inputMdxPath, value: inputMdx }),
      {
        format: "mdx",
        remarkPlugins: [[plugin, options]],
        jsx: true,
      },
    );
    // The mdx compiler doesn't change the vfile path extension so let's fix
    // that. See https://github.com/mdx-js/mdx/issues/2462
    result.path = result.path.replace(/.mdx$/, ".js");
    return result;
  };

  return compileWithPlugin;
}
