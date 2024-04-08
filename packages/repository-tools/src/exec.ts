import { exec, execFile } from "child_process";
import { promisify } from "node:util";

export { execSync, execFileSync } from "child_process";

export const execAsync = promisify(exec);
export const execFileAsync = promisify(execFile);
