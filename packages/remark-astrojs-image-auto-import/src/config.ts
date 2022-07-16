// import type { Element } from "hast";
export interface RemarkAstroJSImageAutoImportOptions {
  /**
   * When an attribute points at a file that isn't present on the local
   * filesystem an exception will be thrown by default. This option disables
   * that behavior and causes the file to be skipped.
   *
   * @default false
   */
  ignoreFileNotFound?: boolean;
  /**
   * Skip when an attribute points to an HTTP URL that isn't local
   *
   * @default true
   */
  ignoreNonFileUrl?: boolean;
}

export type RemarkAstroJSImageAutoImportConfig =
  Required<RemarkAstroJSImageAutoImportOptions>;

const configDefaults: RemarkAstroJSImageAutoImportConfig = {
  ignoreFileNotFound: false,
  ignoreNonFileUrl: true,
};

export function getConfig(
  options: RemarkAstroJSImageAutoImportOptions,
): RemarkAstroJSImageAutoImportConfig {
  return Object.assign(configDefaults, options);
}
