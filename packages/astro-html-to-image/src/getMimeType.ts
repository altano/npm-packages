import { contentType } from "mime-types";
import type { ImageFormat } from "./types.js";

export function getMimeType<Format extends ImageFormat>(
  format: Format,
): string {
  const type = contentType(format);
  return type === false ? `image/${format}` : type;
}
