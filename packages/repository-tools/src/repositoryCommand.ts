import { execFileAsync, execFileSync } from "./exec.js";
import {} from "child_process";

type RepositoryCommand = "git" | "hg" | "sl" | "svn" | "svnadmin" | "svnrdump";

const environment = {
  git: {
    // non-interactive
    GIT_TERMINAL_PROMPT: "0",
    // don't use global config
    GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_CONFIG_SYSTEM: "/dev/null",
    // user config
    GIT_COMMITTER_NAME: "alan",
    GIT_COMMITTER_EMAIL: "alan@example.com",
    GIT_AUTHOR_NAME: "alan",
    GIT_AUTHOR_EMAIL: "alan@example.com",
  },
  hg: {
    // don't use global config
    HGRCPATH: "/dev/null",
    // don't use global config
    HGUSER: "alan",
    EMAIL: "alan@example.com",
  },
  sl: {
    // don't use global config
    HGRCPATH: "/dev/null",
    // don't use global config
    HGUSER: "alan",
    EMAIL: "alan@example.com",
  },
  svn: {},
  svnadmin: {},
  svnrdump: {},
} as const satisfies Record<RepositoryCommand, NodeJS.ProcessEnv>;

export async function repositoryExec(
  cwd: string,
  command: RepositoryCommand,
  args: readonly string[],
): Promise<string> {
  // const msg = `Executing command: ${command} ${args.join(" ")}`;
  // console.time(msg);
  return execFileAsync(command, args, {
    cwd: cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      ...environment[command],
    },
  }).then(({ stdout, stderr }) => {
    // console.timeEnd(msg);
    return stderr ? Promise.reject(new Error(stderr.trim())) : stdout.trim();
  });
}

export function repositoryExecSync(
  cwd: string,
  command: RepositoryCommand,
  args: readonly string[],
): string {
  // const msg = `Executing command: ${command} ${args.join(" ")}`;
  // console.time(msg);
  const result = execFileSync(command, args, {
    cwd: cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      ...environment[command],
    },
  }).trim();
  // console.timeEnd(msg);
  return result;
}

export const createExecForDirectory = (
  cwd: string,
): ((command: RepositoryCommand, args: readonly string[]) => Promise<string>) =>
  repositoryExec.bind(null, cwd);

// Not being used.
// export const createExecSyncForDirectory = (
//   cwd: string,
// ): ((command: RepositoryCommand, args: readonly string[]) => string) =>
//   repositoryExecSync.bind(null, cwd);
