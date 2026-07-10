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

/**
 * Environment variables that pin git to one particular repository, work tree,
 * index, or object store.
 *
 * Git exports several of these before running a hook, so every process a hook
 * spawns inherits them. We always point git at a directory of our choosing
 * (via cwd) and want an answer about *that* directory, so they have to go.
 *
 * GIT_DIR is the worst offender: when it is set and GIT_WORK_TREE isn't, git
 * skips repository discovery entirely and "tells Git that you are at the top
 * level of the working tree", so `git rev-parse --show-toplevel` echoes back
 * the directory we asked about instead of the root containing it.
 *
 * https://github.com/altano/npm-packages/issues/299
 *
 * Variables that only tune discovery, and that a user has to opt into
 * deliberately (GIT_CEILING_DIRECTORIES, GIT_DISCOVERY_ACROSS_FILESYSTEM), are
 * intentionally left alone.
 */
const gitRepositoryVariables = [
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_COMMON_DIR",
  "GIT_INDEX_FILE",
  "GIT_INDEX_VERSION",
  "GIT_OBJECT_DIRECTORY",
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_NAMESPACE",
  "GIT_PREFIX",
  "GIT_QUARANTINE_PATH",
] as const;

/**
 * Inherited environment variables to drop, per command. The other version
 * control systems have no equivalent of GIT_DIR: they're told which repository
 * to use with a flag, never with the environment.
 */
const removedEnvironment = {
  git: gitRepositoryVariables,
  hg: [],
  sl: [],
  svn: [],
  svnadmin: [],
  svnrdump: [],
} as const satisfies Record<RepositoryCommand, readonly string[]>;

function getEnvironment(command: RepositoryCommand): NodeJS.ProcessEnv {
  const result: NodeJS.ProcessEnv = {
    ...process.env,
    ...environment[command],
  };
  for (const variable of removedEnvironment[command]) {
    delete result[variable];
  }
  return result;
}

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
    env: getEnvironment(command),
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
    env: getEnvironment(command),
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
