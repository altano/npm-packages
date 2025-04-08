import { deriveConfig } from "@altano/testing";

export default deriveConfig({
  test: {
    testTimeout: 120_000, // these tests are slow af in github actions
  },
});
