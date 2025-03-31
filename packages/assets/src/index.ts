import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";

const resolve = createRequire(import.meta.url).resolve;

/** @returns The file path for the Inter woff font file at the given weight */
export function getInterPath(fontWeight: number): string {
  return resolve(
    `@fontsource/inter/files/inter-latin-${fontWeight}-normal.woff`,
  );
}

/** @returns The node Buffer for the Inter woff font file at the given weight */
export async function getInterBuffer(fontWeight: number): Promise<Buffer> {
  return readFile(getInterPath(fontWeight));
}
