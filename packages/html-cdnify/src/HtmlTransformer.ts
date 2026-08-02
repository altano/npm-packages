import trumpet, { type Trumpet } from "@gofunky/trumpet";
import { buffer } from "node:stream/consumers";

export type TrumpetTransformStream = Trumpet;

export default class HtmlTransformer {
  private transformStream: TrumpetTransformStream;

  constructor(/*public inputPath: string*/) {
    this.transformStream = trumpet();
  }

  /**
   * Get the underlying transform stream
   */
  get stream(): Trumpet {
    return this.transformStream;
  }

  /**
   * Get a promise to the complete output Buffer (alternative API to dealing with stream)
   */
  get outputBufferPromise(): Promise<Buffer> {
    return buffer(this.stream);
  }
}
