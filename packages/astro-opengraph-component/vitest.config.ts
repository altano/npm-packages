import { deriveConfig } from "@altano/testing";

export default deriveConfig({
  test: {
    // environment: "happy-dom",
    coverage: {
      // TODO remove this (enable coverage)
      enabled: false,
    },
    setupFiles: ["./tests/unit/utils/setup.ts"],
  },
});
