import path from "node:path";
import findCacheDirectory from "find-cache-dir";
import { bundleSupportingRepositoryTypes, createBundle } from "./createBundle";
import { type RepositoryType } from "../../src/types";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import memize from "memize";

const getTemplateHash = memize((templateDirectory: string) => {
  // we don't really care about file content, so just treat the template's
  // directory tree as our bundle cache key. Only if the tree structure changes
  // do we regenerate bundles.
  const stdout = execFileSync(`tree`, {
    cwd: templateDirectory,
    encoding: "utf8",
  });
  const templateHash = hash(stdout);

  const currentCacheDir = path.join(getCacheDir(), templateHash);
  fs.mkdirSync(currentCacheDir, { recursive: true });

  return templateHash;
});

function exists(path: string): boolean {
  try {
    return fs.existsSync(path);
  } catch (e) {
    return false;
  }
}

function hash(str: string): string {
  return crypto.createHash("md5").update(str).digest("hex");
}

function getCacheDir(): string {
  return (
    findCacheDirectory({
      name: "@altano/repository-tools",
      create: true,
    }) ?? path.join("node_modules", ".cache", "@altano/repository-tools")
  );
}

export function getBundlePath(type: RepositoryType): string {
  const templateHash = getTemplateHash(getTemplateDirectory());
  return path.join(getCacheDir(), templateHash, `${type}.bundle`);
}

export async function setup(): Promise<void> {
  // create bundles from the template directory for the VCS that support it
  const templateDirectory = getTemplateDirectory();
  for (const type of bundleSupportingRepositoryTypes) {
    const bundlePath = getBundlePath(type);
    if (!exists(bundlePath)) {
      await createBundle(type, templateDirectory, bundlePath);
    }
  }
}

function getTemplateDirectory(): string {
  return path.resolve(import.meta.dirname, "..", "repository-template");
}

export async function teardown(): Promise<void> {}
