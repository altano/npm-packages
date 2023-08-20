import { createRequire } from "node:module";

const resolve = createRequire(import.meta.url).resolve;

export function getFontPath(font) {
  return resolve(`@altano/assets/fonts/${font}`);
}
