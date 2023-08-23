import * as stream from "stream";
import * as fs from "fs";
import * as path from "path";

let trumpet = require("trumpet");
let safeWriteStream = require("safe-write-stream");
let streamToPromise = require("stream-to-promise");

// @TODO Move...
export class TrumpetTransformStream extends stream.Transform {
  selectAll: (selector: string, callback: (elem: HTMLElement) => void) => void;
}

export default class HtmlTransformer {
  private transformStream: TrumpetTransformStream;

  constructor(/*public inputPath: string*/) {
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
  get outputBufferPromise(): Promise<Buffer> {
    return streamToPromise(this.stream);
  }
};