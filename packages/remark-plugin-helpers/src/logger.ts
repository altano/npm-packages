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

  log(message: string): void {
    this.#logger(message);
  }

  logVFileOperation(vfile: VFile): () => void {
    // TODO Consider logging the relative path to the file as well
    return this.logOperation(vfile.basename ?? "");
  }

  logOperation(operation: string): () => void {
    const timeStart = performance.now();
    return () => {
      const duration = Logger.#getTimeStat(timeStart, performance.now());
      const message = `${operation} ${dim(`(+${duration})`)}`;
      this.log(message);
    };
  }
}
