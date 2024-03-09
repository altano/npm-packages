import { describe, expect } from "vitest";
import { middleware } from "./utils/makeTest";

describe("endpoint", async () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss />`;
  middleware.should("gracefully ignore endpoint responses", {
    requestUrl: `http://example.com/rss.xml`,
    format: "png",
    snapshot: false,
    getComponentResponse: async () => ({
      body: body,
    }),
    async testFn(response) {
      expect(response).not.instanceOf(Response);
      expect(response.body).toEqual(body);
    },
  });
});
