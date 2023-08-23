import * as stream from "stream";
export declare class TrumpetTransformStream extends stream.Transform {
    selectAll: (selector: string, callback: (elem: HTMLElement) => void) => void;
}
export default class HtmlTransformer {
    private transformStream;
    constructor();
    /**
     * Get the underlying transform stream
     */
    stream: TrumpetTransformStream;
    /**
     * Get a promise to the complete output Buffer (alternative API to dealing with stream)
     */
    outputBufferPromise: Promise<Buffer>;
}
