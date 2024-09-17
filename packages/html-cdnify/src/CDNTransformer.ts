import { unionBy, merge, mergeWith, type MergeWithCustomizer } from "lodash";
import urlConverter from "./urlConverter.js";

import * as HtmlAttributeStreamTransformer from "./HtmlAttributeStreamTransformer.js";

export type CDNTransformFunction = (
  cdnUrl: string,
  oldUrl: string,
  bufferPath: string,
) => string;

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
  static isTransformDefinition(
    a: unknown,
  ): a is HtmlAttributeStreamTransformer.TransformDefinition {
    return (
      a != null &&
      typeof a === "object" &&
      "selector" in a &&
      "attribute" in a &&
      typeof a.selector === "string" &&
      typeof a.selector === "string" &&
      typeof a.attribute === "string"
    );
  }

  static isTransformDefinitions(
    a: unknown,
  ): a is HtmlAttributeStreamTransformer.TransformDefinition[] {
    return (
      Array.isArray(a) &&
      a.length > 0 &&
      OptionsMerger.isTransformDefinition(a[0])
    );
  }

  static mergeCustomizer: MergeWithCustomizer = (objValue, srcValue) => {
    if (
      OptionsMerger.isTransformDefinitions(objValue) &&
      OptionsMerger.isTransformDefinitions(srcValue)
    ) {
      const result = unionBy(
        srcValue,
        objValue, // reverse order to allow srcValue to take precedence
        (value: HtmlAttributeStreamTransformer.TransformDefinition) =>
          `${value.selector} / ${value.attribute}`,
      );

      return result;
    } else {
      return undefined;
    }
  };

  static merge<T, U, V, W>(
    target: T,
    source1: U,
    source2: V,
    source3: W,
  ): T & U & V & W {
    return mergeWith(
      target,
      source1,
      source2,
      source3,
      OptionsMerger.mergeCustomizer,
    );
  }
}

/**
 * Wraps a node-trumpet Transform stream, w/ HTML as input and
 * HTML as output. The output will have all non-absolute-URL
 * attributes that identify CDN-able resources converted to
 * use the given CDN URL.
 */
export class CDNTransformer extends HtmlAttributeStreamTransformer.HtmlAttributeStreamTransformer {
  public cdnOptions: Required<CDNTransformerOptions>;

  constructor(cdnOptions: CDNTransformerOptions) {
    super(
      OptionsMerger.merge(
        {},
        CDNTransformer.#defaultHtmlAttributeStreamTransformerOptions,
        {
          transformDefinitions: [],
          transformFunction: (attribute: string) =>
            this.#cdnifyAttribute(attribute),
        },
        {
          transformDefinitions: cdnOptions.transformDefinitions,
        },
      ),
    );

    this.cdnOptions = merge(
      {
        transformDefinitions: [],
      },
      CDNTransformer.#defaultCdnOptions,
      cdnOptions,
    );

    if (typeof this.cdnOptions.cdnUrl !== "string") {
      throw new Error(`Invalid cdnUrl specified.`);
    }
  }

  #cdnifyAttribute(oldUrl: string): string {
    return this.cdnOptions.transformFunction(
      this.cdnOptions.cdnUrl,
      oldUrl,
      this.cdnOptions.bufferPath,
    );
  }

  static #defaultCdnOptions = {
    bufferPath: ".",
    transformFunction: urlConverter,
  } as const;

  public static defaultTransformFunction: CDNTransformFunction =
    CDNTransformer.#defaultCdnOptions.transformFunction;

  static #defaultHtmlAttributeStreamTransformerOptions = {
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
        attributeParser(
          attr: string,
          transformFunction: HtmlAttributeStreamTransformer.TransformFunction,
        ): string {
          return attr
            .split(",")
            .map((imgInfo) => imgInfo.replace(/([^ ]+)/, transformFunction))
            .join(",");
        },
      },
    ],
  } as const;
}
