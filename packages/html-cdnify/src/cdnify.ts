import { CDNTransformer, CDNTransformerOptions } from "./CDNTransformer.js";
export * from "./CDNTransformer.js";

import streamifier from "streamifier";

export interface CdnifyOptions extends CDNTransformerOptions {
  buffer: string | Buffer;
}

/**
 * Alternative wrapper for simple Promise-based use of library (as opposed to transform stream)
 */
export function cdnify(options: CdnifyOptions): Promise<Buffer> {
  if (typeof options.buffer !== "string") {
    options.buffer = options.buffer.toString();
  }

  const cdnTransformer = new CDNTransformer(options);

  streamifier.createReadStream(options.buffer).pipe(cdnTransformer.stream);

  return cdnTransformer.outputBufferPromise;
}

export default cdnify;
