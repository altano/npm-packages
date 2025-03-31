import type { Matcher } from "../matcher.js";

const toHaveHeader: Matcher = function (
  response: Response,
  header: string,
  value?: string | number,
) {
  const headers = response.headers;
  const hasProperty = headers.has(header);
  const receivedValue = headers.get(header);

  const { isNot } = this;

  return {
    message: () =>
      value === undefined
        ? `Received ${isNot ? "should not have" : "does not have"} the header "${header}"`
        : `Header "${header}" ${isNot ? "should not be" : "is not"} expected value`,
    pass:
      hasProperty && (value === undefined || this.equals(receivedValue, value)),
    actual: receivedValue,
    expected: value,
  };
};

export default toHaveHeader;
