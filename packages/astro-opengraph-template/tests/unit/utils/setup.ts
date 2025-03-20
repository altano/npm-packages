import { vitest } from "vitest";
import { MockImageService } from "./mockImageService.js";

vitest.mock("astro:assets", () => {
  return {
    default: MockImageService,
    ...MockImageService,
  };
});
