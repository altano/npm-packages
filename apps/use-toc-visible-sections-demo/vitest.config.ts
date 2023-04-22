import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    // setupFiles: "./src/test/setup.ts",
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
