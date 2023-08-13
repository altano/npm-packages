import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest";

describe("endpoint", async () => {
  middleware.should("gracefully ignore endpoint responses", {
    requestUrl: `http://example.com/rss.xml`,
    format: "png",
    snapshot: false,
    getComponentResponse: async () => ({
      body: `<?xml version="1.0" encoding="UTF-8"?><rss />`,
    }),
    async testFn(response) {
      expect(response.headers.get("Content-Type")).toEqual(
        "text/plain;charset=UTF-8",
      );
      expect(response.headers.get("Content-Disposition")).toBeNull();
    },
  });
});
