import { logger } from "@it-astro:logger:astro-prettier-response";
import { format } from "./prettier.js";

export async function formatOrReturn(
  filepath: string,
  source: string,
): Promise<string> {
  try {
    const result = await format(source, {
      filepath: filepath,
    });
    logger.debug(`successfully formatted`);
    return result;
  } catch (e: unknown) {
    logger.error(`failed to format`);
    return source;
  }
}
