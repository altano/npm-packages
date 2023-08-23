"use strict";
const _ = require("lodash");
const urlConverter_1 = require("./urlConverter");
const HtmlAttributeStreamTransformer = require("./HtmlAttributeStreamTransformer");
/**
 * Handles merging objects that have TransformDefinition arrays
 */
class OptionsMerger {
    static isTransformDefinition(a) {
        return typeof (a.selector) === "string" && typeof (a.attribute) === "string";
    }
    static isTransformDefinitions(a) {
        return Array.isArray(a) && a.length > 0 && OptionsMerger.isTransformDefinition(a[0]);
    }
    static merge(target, source1, source2, source3) {
        return _.mergeWith(target, source1, source2, source3, OptionsMerger.mergeCustomizer);
    }
}
OptionsMerger.mergeCustomizer = (objValue, srcValue) => {
    if (OptionsMerger.isTransformDefinitions(objValue)
        || OptionsMerger.isTransformDefinitions(srcValue)) {
        let result = _.unionBy(srcValue, objValue, // reverse order to allow srcValue to take precedence
            (value) => `${value.selector} / ${value.attribute}`);
        return result;
    }
    else {
        return undefined;
    }
};
/**
 * Wraps a node-trumpet Transform stream, w/ HTML as input and
 * HTML as output. The output will have all non-absolute-URL
 * attributes that identify CDN-able resources converted to
 * use the given CDN URL.
 */
class CDNTransformer extends HtmlAttributeStreamTransformer.HtmlAttributeStreamTransformer {
    constructor(cdnOptions) {
        super(OptionsMerger.merge({}, CDNTransformer.defaultHtmlAttributeStreamTransformerOptions, {
            transformDefinitions: [],
            transformFunction: (attribute) => this.cdnifyAttribute(attribute)
        }, {
            transformDefinitions: cdnOptions.transformDefinitions
        }));
        this.cdnOptions = _.merge({}, CDNTransformer.defaultCdnOptions, cdnOptions);
        if (typeof this.cdnOptions.cdnUrl !== "string") {
            throw new Error(`Invalid cdnUrl "${this.cdnOptions.cdnUrl}" specified.`);
        }
    }
    cdnifyAttribute(oldUrl) {
        return this.cdnOptions.transformFunction(this.cdnOptions.cdnUrl, oldUrl, this.cdnOptions.bufferPath);
    }
}
CDNTransformer.defaultCdnOptions = {
    cdnUrl: undefined,
    bufferPath: ".",
    transformFunction: urlConverter_1.default,
};
CDNTransformer.defaultTransformFunction = CDNTransformer.defaultCdnOptions.transformFunction;
CDNTransformer.defaultHtmlAttributeStreamTransformerOptions = {
    transformFunction: undefined,
    attributeToMarkElementToBeIgnored: "data-cdn-ignore",
    // inspired by https://github.com/callumlocke/grunt-cdnify/blob/master/tasks/cdnify.js#L31
    transformDefinitions: [
        {
            selector: `video[poster]:not([data-cdn-ignore])`,
            attribute: "poster",
        },
        {
            selector: `img[data-src]:not([data-cdn-ignore])`,
            attribute: "data-src",
        },
        {
            selector: `script[src]:not([data-cdn-ignore])`,
            attribute: "src",
        },
        {
            selector: `source[src]:not([data-cdn-ignore])`,
            attribute: "src",
        },
        {
            selector: `link[rel="apple-touch-icon"]:not([data-cdn-ignore])`,
            attribute: "href",
        },
        {
            selector: `link[rel="icon"]:not([data-cdn-ignore])`,
            attribute: "href",
        },
        {
            selector: `link[rel="shortcut icon"]:not([data-cdn-ignore])`,
            attribute: "href",
        },
        {
            selector: `link[rel="stylesheet"]:not([data-cdn-ignore])`,
            attribute: "href",
        },
        {
            selector: `img[src]:not([data-cdn-ignore])`,
            attribute: "src",
        },
        {
            selector: `img[srcset]:not([data-cdn-ignore])`,
            attribute: "srcset",
            attributeParser: (attr, transformFunction) => {
                return attr.split(",")
                    .map(imgInfo => imgInfo.replace(/([^ ]+)/, transformFunction))
                    .join(",");
            }
        },
    ],
};
exports.CDNTransformer = CDNTransformer;
;
