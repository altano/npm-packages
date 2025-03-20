import { contentType } from "mime-types";
import { ImageFormat } from ".";

export function getMimeType<Format extends ImageFormat>(
  format: Format,
): string {
  const type = contentType(format);
  return type === false ? `image/${format}` : type;
}
