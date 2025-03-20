import { deriveConfig } from "@altano/testing";

export default deriveConfig({
  test: {
    // TODO remove this (enable coverage)
    coverage: {
      enabled: false,
    },
    setupFiles: ["./tests/unit/utils/setup.ts"],
  },
});
