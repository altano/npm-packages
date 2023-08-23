import * as path from "path";
import * as _ from "lodash";
import HtmlTransformer from "./HtmlTransformer";
import urlConverter from "./urlConverter";

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

export type TransformFunction = (oldAttribute: string) => string;

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
export class HtmlAttributeStreamTransformer extends HtmlTransformer {
  public condensedTransformOptions: TransformDefinition[];

  constructor(public options: HtmlAttributeStreamTransformerOptions) {
    super();

    this.processTransforms();

    this.applyTransforms();
  }

  static attributeParsers: AttributeParsers = {
    default: (attr, transformFunction) => transformFunction(attr)
  };

  protected applyTransforms() {
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

  private processTransforms() {
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
        attribute,
        attributeParser,
        selector: likeTransformOptions
                    .map(likeTransformOption => likeTransformOption.selector)
                    .join(", ")
      };
    });
  }
};