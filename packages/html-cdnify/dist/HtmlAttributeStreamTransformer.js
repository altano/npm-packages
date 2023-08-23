"use strict";
const _ = require("lodash");
const HtmlTransformer_1 = require("./HtmlTransformer");
/**
 * Wraps a node-trumpet Transform stream, w/ HTML as input and
 * HTML as output. The output will have all non-absolute-URL
 * attributes that identify CDN-able resources converted to
 * use the given CDN URL.
 */
class HtmlAttributeStreamTransformer extends HtmlTransformer_1.default {
    constructor(options) {
        super();
        this.options = options;
        this.processTransforms();
        this.applyTransforms();
    }
    applyTransforms() {
        this.condensedTransformOptions.forEach(settings => {
            let selector = settings.selector;
            let attribute = settings.attribute;
            let parser = settings.attributeParser;
            this.stream.selectAll(selector, elem => {
                let oldAttributeValue = elem.getAttribute(attribute);
                // Check that the attribute is set (which should always be the case) and the
                // typeof=string, which will be false in the case of empty attributes (which
                // cause getAttribute() to return the boolean true)
                if (typeof oldAttributeValue === "string") {
                    let newAttributeValue = parser(oldAttributeValue, this.options.transformFunction);
                    if (newAttributeValue && newAttributeValue !== oldAttributeValue) {
                        elem.setAttribute(attribute, newAttributeValue);
                    }
                }
            });
        });
        // Run cleanup transform last
        if (this.options.attributeToMarkElementToBeIgnored) {
            this.stream.selectAll(`[${this.options.attributeToMarkElementToBeIgnored}]`, elem => {
                elem.removeAttribute(this.options.attributeToMarkElementToBeIgnored);
            });
        }
    }
    processTransforms() {
        this.options.transformDefinitions.forEach(option => {
            if (!option.attributeParser) {
                option.attributeParser = HtmlAttributeStreamTransformer.attributeParsers["default"];
            }
            if (typeof option.selector !== "string") {
                throw new Error(`Invalid selector "${option.selector}" specified.`);
            }
            if (typeof option.attribute !== "string") {
                throw new Error(`Invalid attribute "${option.attribute}" specified.`);
            }
            if (!(option.attributeParser instanceof Function)) {
                throw new Error("Invalid attributeParser specified.");
            }
        });
        /**
         * As a performance enhancement, we can condense the list of transformDefinitions such that
         * selectors with the same attribute and attributeParser can be combined into a single,
         * comma-delimited CSS selector.
         */
        let groupedTransformOptions = _.groupBy(this.options.transformDefinitions, obj => {
            return [obj.attribute, obj.attributeParser];
        });
        this.condensedTransformOptions = Object.keys(groupedTransformOptions).map(key => {
            let likeTransformOptions = groupedTransformOptions[key];
            let attribute = likeTransformOptions[0].attribute;
            let attributeParser = likeTransformOptions[0].attributeParser;
            return {
                attribute: attribute,
                attributeParser: attributeParser,
                selector: likeTransformOptions
                    .map(likeTransformOption => likeTransformOption.selector)
                    .join(", ")
            };
        });
    }
}
HtmlAttributeStreamTransformer.attributeParsers = {
    default: (attr, transformFunction) => transformFunction(attr)
};
exports.HtmlAttributeStreamTransformer = HtmlAttributeStreamTransformer;
;
