import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), svelte()],
  build: {
    excludeMiddleware: true,
  },
  experimental: {
    assets: true,
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp", // 'astro/assets/services/squoosh' | 'astro/assets/services/sharp' | string,
      config: {
        // ... service-specific config. Optional.
      },
    },
  },
});
