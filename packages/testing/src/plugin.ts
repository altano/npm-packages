import type { Vite, VitestPluginContext } from "vitest/node";

export function plugin(): Vite.Plugin {
  return {
    name: "vitest:@altano/testing/plugin",
    configureVitest({ vitest }: VitestPluginContext) {
      // ...
      vitest.config.dir = "tests/unit";
      vitest.config.setupFiles.push("@altano/testing/setup");

      vitest.config.coverage.enabled = true;
      vitest.config.coverage.include.push("src");
      vitest.config.coverage.provider = "v8";
      vitest.config.coverage.all = true;
      vitest.config.coverage.clean = true;
      vitest.config.coverage.thresholds = { "100": true };
      vitest.config.coverage.reportsDirectory = ".coverage";

      vitest.config.typecheck.tsconfig = "tests/tsconfig.json";
      vitest.config.typecheck.enabled = true;
    },
  };
}
