/**
 * Initialize the wasm version of Resvg for Node.js
 */

import { readFile } from "node:fs/promises";
import { initWasm } from "@resvg/resvg-wasm";
import { createRequire } from "node:module";

const resolve = createRequire(import.meta.url).resolve;

export default async function initialize(): Promise<void> {
  const wasmModulePath = resolve("@resvg/resvg-wasm/index_bg.wasm");
  const indexBG = await readFile(wasmModulePath);
  await initWasm(indexBG);
}
