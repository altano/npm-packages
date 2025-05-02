import mime from "mime-types";
import { is400 } from "./is400.js";

export function synthesizeFilename(response: Response): string | null {
  const contentType = response.headers.get("content-type");
  // I don't know how to produce a null content-type in testing
  /* v8 ignore next 8 */
  if (contentType == null) {
    if (is400(response.status)) {
      // let's just say all 400 responses with no Content-Type are html?
      return "index.html";
    }

    return null;
  }

  // We have a content-type, so derive the filename from that
  const extensionFromContentType = mime.extension(contentType);
  if (!extensionFromContentType) {
    // I'm pretty sure everything that Prettier can parse has a mime-type in the
    // mime-types db, so this is probably something we don't know anything
    // about. Let's just bail.
    return null;
  }

  return `file.${extensionFromContentType}`;
}
