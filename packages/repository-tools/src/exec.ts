import { exec, execFile } from "child_process";
import { promisify } from "node:util";

export { execSync, execFileSync } from "child_process";

export const execAsync: typeof exec.__promisify__ = promisify(exec);
export const execFileAsync: typeof execFile.__promisify__ = promisify(execFile);
