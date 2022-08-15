import debug from "debug";
import { performance } from "perf_hooks";
import { dim } from "kleur/colors";

import type { VFile } from "vfile";

export class Logger {
  #logger: debug.Debugger;

  constructor(name: string) {
    this.#logger = debug(name);
  }

  static #getTimeStat(timeStart: number, timeEnd: number): string {
    const buildTime = timeEnd - timeStart;
    return buildTime < 750
      ? `${Math.round(buildTime)}ms`
      : `${(buildTime / 1e3).toFixed(2)}s`;
  }

  logVFileOperation(vfile: VFile): () => void {
    if (vfile.basename == null || vfile.basename === "") {
      this.#logger(`vfile: ${vfile}`);
    }
    const operation = vfile.basename ?? "";
    // `${dim(vfile.dirname ?? "")}/${cyan(vfile.basename ?? "")}`
    return this.logOperation(operation);
  }

  logOperation(operation: string): () => void {
    const timeStart = performance.now();
    return () => {
      const duration = Logger.#getTimeStat(timeStart, performance.now());
      const message = `${operation} ${dim(`(+${duration})`)}`;
      this.#logger(message);
    };
  }
}
