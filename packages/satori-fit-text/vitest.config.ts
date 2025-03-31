import { deriveConfig } from "@altano/testing";

export default deriveConfig({
  test: {
    testTimeout: 30_000, // these tests are slow af in github actions
  },
});
