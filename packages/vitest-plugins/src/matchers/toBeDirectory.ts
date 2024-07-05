import type { Matcher } from "./matcher.js";
import fs from "node:fs";

function directoryExists(path: string): boolean {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (e) {
    return false;
  }
}

const toBeDirectory: Matcher = function (path: string) {
  return {
    message: () =>
      `Received is not a directory (or cannot be accessed by the current user)`,
    pass: directoryExists(path),
  };
};

export default toBeDirectory;
