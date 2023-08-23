import {CDNTransformer, CDNTransformerOptions} from "./CDNTransformer";
export * from "./CDNTransformer";

let streamifier = require("streamifier");

export interface CdnifyOptions extends CDNTransformerOptions {
  buffer: string | Buffer;
}

/**
 * Alternative wrapper for simple Promise-based use of library (as opposed to transform stream)
 */
export function cdnify(options: CdnifyOptions) {
  if (typeof options.buffer !== "string") {
    options.buffer = options.buffer.toString();
  }

  let cdnTransformer = new CDNTransformer(options);

  streamifier
    .createReadStream(options.buffer)
    .pipe(cdnTransformer.stream);

  return cdnTransformer.outputBufferPromise;
}

export default cdnify;