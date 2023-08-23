import { CDNTransformerOptions } from "./CDNTransformer";
export * from "./CDNTransformer";
export interface CdnifyOptions extends CDNTransformerOptions {
    buffer: string | Buffer;
}
/**
 * Alternative wrapper for simple Promise-based use of library (as opposed to transform stream)
 */
export declare function cdnify(options: CdnifyOptions): Promise<Buffer>;
export default cdnify;
