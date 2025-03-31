import type { Matcher } from "../matcher.js";

const toHaveStatus: Matcher = function (
  response: Response,
  expectedStatus: number,
) {
  const receivedStatus = response.status;

  const { isNot } = this;

  return {
    message: () =>
      `Status ${isNot ? "should not be expected value" : "is not expected value"}`,
    pass: this.equals(receivedStatus, expectedStatus),
    actual: receivedStatus,
    expected: expectedStatus,
  };
};

export default toHaveStatus;
