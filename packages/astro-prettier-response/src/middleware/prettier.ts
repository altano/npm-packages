import prettier, { type Options } from "prettier";
import config from "virtual:astro-prettier-response/config";

function enhanceOptions(options: Options = {}): Options {
  if (!config.formatXml) {
    return options;
  }

  const givenPlugins = options.plugins ?? [];
  return {
    ...options,
    plugins: [...givenPlugins, "@prettier/plugin-xml"],
  };
}

export async function format(
  source: string,
  options?: Options,
): Promise<string> {
  return prettier.format(source, enhanceOptions(options));
}

export async function getFileInfo(
  source: string,
  options?: Options,
): Promise<prettier.FileInfoResult> {
  return prettier.getFileInfo(source, enhanceOptions(options));
}
