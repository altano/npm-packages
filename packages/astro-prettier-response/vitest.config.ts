import { deriveConfigWithoutPlugins } from "@altano/testing";

export default deriveConfigWithoutPlugins({
  test: {
    setupFiles: ["./tests/unit/utils/setup.ts"],
  },
});
