import * as path from "path";
import * as _ from "lodash";
import HtmlTransformer from "./HtmlTransformer";
import urlConverter from "./urlConverter";

import * as HtmlAttributeStreamTransformer from "./HtmlAttributeStreamTransformer";

export type CDNTransformFunction = (cdnUrl: string, oldUrl: string, bufferPath: string) => string;

export interface CDNTransformerOptions {
  cdnUrl: string;
  bufferPath?: string;

  transformDefinitions?: HtmlAttributeStreamTransformer.TransformDefinition[];
  transformFunction?: CDNTransformFunction;
}

/**
 * Handles merging objects that have TransformDefinition arrays
 */
class OptionsMerger {
  static isTransformDefinition(a: any): a is HtmlAttributeStreamTransformer.TransformDefinition {
    return typeof(a.selector) === "string" && typeof(a.attribute) === "string";
  }

  static isTransformDefinitions(a: any): a is HtmlAttributeStreamTransformer.TransformDefinition[] {
    return Array.isArray(a) && a.length > 0 && OptionsMerger.isTransformDefinition(a[0]);
  }

  static mergeCustomizer: _.MergeWithCustomizer = (objValue, srcValue) => {

    if (OptionsMerger.isTransformDefinitions(objValue)
          || OptionsMerger.isTransformDefinitions(srcValue)) {
      let result = _.unionBy(
        srcValue, objValue, // reverse order to allow srcValue to take precedence
        (value: HtmlAttributeStreamTransformer.TransformDefinition) =>
          `${value.selector} / ${value.attribute}`
      );

      return result;
    }
    else {
      return <any>undefined;
    }
  };

  static merge<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W {
    return _.mergeWith(target, source1, source2, source3, OptionsMerger.mergeCustomizer);
  }
}

/**
 * Wraps a node-trumpet Transform stream, w/ HTML as input and
 * HTML as output. The output will have all non-absolute-URL
 * attributes that identify CDN-able resources converted to
 * use the given CDN URL.
 */
export class CDNTransformer extends HtmlAttributeStreamTransformer.HtmlAttributeStreamTransformer {
  public cdnOptions: CDNTransformerOptions;

  constructor(cdnOptions: CDNTransformerOptions) {
    super(
      OptionsMerger.merge(
        {},
        CDNTransformer.defaultHtmlAttributeStreamTransformerOptions,
        {
          transformDefinitions: [],
          transformFunction: (attribute: string) => this.cdnifyAttribute(attribute)
        },
        {
          transformDefinitions: cdnOptions.transformDefinitions
        }
      )
    );

    this.cdnOptions = _.merge({}, CDNTransformer.defaultCdnOptions, cdnOptions);

    if (typeof this.cdnOptions.cdnUrl !== "string") {
      throw new Error(`Invalid cdnUrl "${this.cdnOptions.cdnUrl}" specified.`);
    }
  }

  private cdnifyAttribute(oldUrl: string) {
    return this.cdnOptions.transformFunction(
      this.cdnOptions.cdnUrl,
      oldUrl,
      this.cdnOptions.bufferPath
    );
  }

  private static defaultCdnOptions: CDNTransformerOptions = {
    cdnUrl: undefined,
    bufferPath: ".",
    transformFunction: urlConverter,
  }

  public static defaultTransformFunction = CDNTransformer.defaultCdnOptions.transformFunction;

  private static defaultHtmlAttributeStreamTransformerOptions: HtmlAttributeStreamTransformer.HtmlAttributeStreamTransformerOptions = {
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
};