import type { Matcher } from "./matcher";
import fs from "node:fs";

function fileExists(path: string): boolean {
  try {
    const stats = fs.statSync(path);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}

const toBeFile: Matcher = function (path: string) {
  return {
    message: () =>
      `${path} is not a file (or cannot be accessed by the current user)`,
    pass: fileExists(path),
    actual: path,
  };
};

export default toBeFile;
