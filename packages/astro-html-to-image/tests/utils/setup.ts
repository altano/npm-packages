import { vitest } from "vitest";

import { MockImageService } from "./mockImageService";

vitest.mock("astro:assets", () => {
  return {
    default: MockImageService,
    ...MockImageService,
  };
});
