import { describe, expect, it, vitest } from "vitest";
import integration from "@altano/astro-prettier-response";
import { onRequest } from "@altano/astro-prettier-response/middleware";

vitest.mock("virtual:astro-prettier-response/config", async () => {
  return {
    default: {},
  };
});

describe("exports", async () => {
  it("should be defined", async () => {
    expect(integration).toBeDefined();
    expect(onRequest).toBeDefined();
  });
});
