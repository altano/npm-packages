import * as HtmlAttributeStreamTransformer from "./HtmlAttributeStreamTransformer";
export declare type CDNTransformFunction = (cdnUrl: string, oldUrl: string, bufferPath: string) => string;
export interface CDNTransformerOptions {
    cdnUrl: string;
    bufferPath?: string;
    transformDefinitions?: HtmlAttributeStreamTransformer.TransformDefinition[];
    transformFunction?: CDNTransformFunction;
}
/**
 * Wraps a node-trumpet Transform stream, w/ HTML as input and
 * HTML as output. The output will have all non-absolute-URL
 * attributes that identify CDN-able resources converted to
 * use the given CDN URL.
 */
export declare class CDNTransformer extends HtmlAttributeStreamTransformer.HtmlAttributeStreamTransformer {
    cdnOptions: CDNTransformerOptions;
    constructor(cdnOptions: CDNTransformerOptions);
    private cdnifyAttribute(oldUrl);
    private static defaultCdnOptions;
    static defaultTransformFunction: (cdnUrl: string, oldUrl: string, bufferPath: string) => string;
    private static defaultHtmlAttributeStreamTransformerOptions;
}
