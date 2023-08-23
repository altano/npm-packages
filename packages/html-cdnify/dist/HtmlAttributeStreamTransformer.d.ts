import HtmlTransformer from "./HtmlTransformer";
export interface HtmlAttributeStreamTransformerOptions {
    transformDefinitions: TransformDefinition[];
    transformFunction: TransformFunction;
    attributeToMarkElementToBeIgnored?: string;
}
export interface TransformDefinition {
    selector: string;
    attribute: string;
    attributeParser?: (oldAttribute: string, transformFunction: TransformFunction) => string;
}
export declare type TransformFunction = (oldAttribute: string) => string;
export interface AttributeParser {
    (oldAttribute: string, transformFunction: TransformFunction): string;
}
export interface AttributeParsers {
    [index: string]: AttributeParser;
}
/**
 * Wraps a node-trumpet Transform stream, w/ HTML as input and
 * HTML as output. The output will have all non-absolute-URL
 * attributes that identify CDN-able resources converted to
 * use the given CDN URL.
 */
export declare class HtmlAttributeStreamTransformer extends HtmlTransformer {
    options: HtmlAttributeStreamTransformerOptions;
    condensedTransformOptions: TransformDefinition[];
    constructor(options: HtmlAttributeStreamTransformerOptions);
    static attributeParsers: AttributeParsers;
    protected applyTransforms(): void;
    private processTransforms();
}
