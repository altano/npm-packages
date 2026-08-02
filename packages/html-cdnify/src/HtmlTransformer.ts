import { buffer } from "node:stream/consumers";
import { HtmlRewriteStream } from "./HtmlRewriteStream.js";

export type { SelectedElement, SelectionHandler } from "./HtmlRewriteStream.js";
export { HtmlRewriteStream } from "./HtmlRewriteStream.js";

export default class HtmlTransformer {
  private transformStream: HtmlRewriteStream = new HtmlRewriteStream();

  /**
   * Get the underlying transform stream
   */
  get stream(): HtmlRewriteStream {
    return this.transformStream;
  }

  /**
   * Get a promise to the complete output Buffer (alternative API to dealing with stream)
   */
  get outputBufferPromise(): Promise<Buffer> {
    return buffer(this.stream);
  }
}
