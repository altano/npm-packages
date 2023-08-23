"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const CDNTransformer_1 = require("./CDNTransformer");
__export(require("./CDNTransformer"));
let streamifier = require("streamifier");
/**
 * Alternative wrapper for simple Promise-based use of library (as opposed to transform stream)
 */
function cdnify(options) {
    if (typeof options.buffer !== "string") {
        options.buffer = options.buffer.toString();
    }
    let cdnTransformer = new CDNTransformer_1.CDNTransformer(options);
    streamifier
        .createReadStream(options.buffer)
        .pipe(cdnTransformer.stream);
    return cdnTransformer.outputBufferPromise;
}
exports.cdnify = cdnify;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cdnify;
