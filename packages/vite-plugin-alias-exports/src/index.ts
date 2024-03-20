import { join, parse } from "path";
import type { Alias, PluginOption } from "vite";
// import { getDirs, hasFile } from "./shared";
// import { removeJson, syncJson } from "./sync";
// import type { AutoAlias, GetDirs } from "./type";

type AutoAlias = {
  root?: string;
  prefix?: string;
  mode?: string;
  aliasPath?: string | null;
};
type GetDirs = any[];
function getDirs(root: string): GetDirs {
  return [];
}

/**
 * @description 默认配置
 */
const DEFAULT_CONFIG: Required<AutoAlias> = {
  root: join(process.cwd(), "src"),
  prefix: "@",
  mode: "sync",
  aliasPath: null,
};

/**
 * @description 生成数组
 * @param dir GetDirs
 * @param root string
 * @param prefix string
 * @returns {Alias[]}
 */
function genArrayAlias(dirs: GetDirs, root: string, prefix: string): Alias[] {
  return [
    {
      find: "@altano/html-cdnify",
      replacement:
        "/Users/alan/src/npm-packages/packages/html-cdnify/dist/index.js",
    },
  ];
  return dirs.reduce<Alias[]>(
    (result, item) => {
      result.push({
        find: new RegExp(`^${prefix}${item.dirName}`),
        replacement: item.dirPath,
      });
      return result;
    },
    [{ find: prefix, replacement: root }],
  );
}

/**
 * @description 合并配置
 * @param baseConfig AutoAlias
 * @returns Required<AutoAlias>
 */
const mergeConfig = (baseConfig: AutoAlias): Required<AutoAlias> => {
  return {
    root: baseConfig.root ?? DEFAULT_CONFIG.root,
    prefix: baseConfig.prefix ?? DEFAULT_CONFIG.prefix,
    mode: baseConfig.mode ?? DEFAULT_CONFIG.mode,
    aliasPath: baseConfig.aliasPath ?? DEFAULT_CONFIG.aliasPath,
  };
};

export default function aliasExports(
  options: AutoAlias = DEFAULT_CONFIG,
): PluginOption {
  const { root, prefix, mode, aliasPath } = mergeConfig(options);
  // if (!hasFile(root)) {
  //   return undefined;
  // } else {
  const dirs = getDirs(root);
  return {
    name: "vite-plugin-auto-alias",
    enforce: "pre",
    config() {
      const alias = genArrayAlias(dirs, root, prefix);
      // syncJson({
      //   aliasPath: aliasPath,
      //   jsJson: jsconfig(process.cwd()),
      //   tsJson: tsconfig(process.cwd()),
      //   alias,
      //   root,
      //   prefix,
      //   mode,
      // });
      return {
        resolve: {
          alias,
        },
      };
    },
    configureServer(server) {
      server.watcher.on("all", (eventName, path) => {
        const { dir, name: unlinkDirName } = parse(path);
        if (dir === root) {
          if (eventName === "addDir") {
            const alias = genArrayAlias(dirs, root, prefix);
            mode !== "off" &&
              // syncJson({
              //   aliasPath: aliasPath,
              //   jsJson: jsconfig(process.cwd()),
              //   tsJson: tsconfig(process.cwd()),
              //   alias,
              //   root,
              //   prefix,
              //   mode,
              // });
              server.restart();
          }

          if (eventName === "unlinkDir") {
            mode !== "off" &&
              // removeJson({
              //   aliasPath: aliasPath,
              //   jsJson: jsconfig(process.cwd()),
              //   tsJson: tsconfig(process.cwd()),
              //   unlinkDirName,
              //   root,
              //   prefix,
              //   mode,
              // });
              server.restart();
          }
        }
      });
    },
  };
  // }
}
