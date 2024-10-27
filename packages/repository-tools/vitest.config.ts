import { deriveConfig } from "@altano/testing";

export default deriveConfig({
  test: {
    testTimeout: 15_000,
    globalSetup: ["./tests/utils/globalSetup.ts"],
  },
});
