import type { AstroIntegrationLogger } from "astro";
import { vi } from "vitest";

export const loggerWithSpy: AstroIntegrationLogger = {
  options: {
    dest: { write: () => true },
    level: "debug",
  },
  label: "astro-prettier-response-tests",
  info: vi.fn(() => {}),
  error: vi.fn(() => {}),
  warn: vi.fn(() => {}),
  debug: vi.fn(() => {}),
  fork() {
    throw new Error(`not impl`);
  },
};

vi.mock("@it-astro:logger:astro-prettier-response", () => {
  return { logger: loggerWithSpy };
});
