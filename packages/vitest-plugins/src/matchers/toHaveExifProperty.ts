import { parse } from "exifr";
import type { Matcher } from "./matcher.js";

export type Input = Parameters<typeof parse>[0];

const toHaveExifProperty: Matcher = async function (
  buffer: Input,
  property: string,
  value?: string | number,
) {
  const exifData = (await parse(buffer)) as unknown;
  const hasProperty = Object.prototype.hasOwnProperty.call(exifData, property);

  const receivedValue =
    // @ts-expect-error we're checking for property existence, so obviously this
    // might not be valid. don't need a TS error to tell us that.
    exifData[property] as unknown;
  const { isNot } = this;

  return {
    message: () =>
      value === undefined
        ? `Received ${isNot ? "should not have" : "does not have"} the property "${property}"`
        : `Property "${property}" ${isNot ? "should not be expected value" : "is not expected value"}`,
    pass:
      hasProperty && (value === undefined || this.equals(receivedValue, value)),
    actual: receivedValue,
    expected: value,
  };
};

export default toHaveExifProperty;
