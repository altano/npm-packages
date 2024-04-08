import type { Matcher } from "./matcher";
import fs from "node:fs";
import crypto from "node:crypto";

function getChecksum(filepath: string): string {
  const hash = crypto.createHash("md5");
  hash.update(fs.readFileSync(filepath));
  return hash.digest("hex");
}

const toEqualFile: Matcher = function (
  receivedPathOfFile: string,
  pathOfFileWithExpectedContents: string,
) {
  const receivedChecksum = getChecksum(receivedPathOfFile);
  const expectedChecksum = getChecksum(pathOfFileWithExpectedContents);
  return {
    message: () =>
      `The checksum of the file contents of the files do not match`,
    pass: this.equals(receivedChecksum, expectedChecksum),
    actual: `Checksum = ${receivedChecksum}`,
    expected: `Checksum = ${expectedChecksum}`,
  };
};

export default toEqualFile;
