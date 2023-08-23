"use strict";
const stream = require("stream");
let trumpet = require("trumpet");
let safeWriteStream = require("safe-write-stream");
let streamToPromise = require("stream-to-promise");
// @TODO Move...
class TrumpetTransformStream extends stream.Transform {
}
exports.TrumpetTransformStream = TrumpetTransformStream;
class HtmlTransformer {
    constructor() {
        this.transformStream = trumpet();
    }
    /**
     * Get the underlying transform stream
     */
    get stream() {
        return this.transformStream;
    }
    /**
     * Get a promise to the complete output Buffer (alternative API to dealing with stream)
     */
    get outputBufferPromise() {
        return streamToPromise(this.stream);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HtmlTransformer;
;
