import type { AstroIntegrationLogger } from "astro";
import { vi } from "vitest";

export const loggerWithSpy: AstroIntegrationLogger = {
  options: {
    destination: { write: () => true },
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
  flush() {
    throw new Error(`not impl`);
  },
  close() {
    throw new Error(`not impl`);
  },
};

vi.mock("@it-astro:logger:astro-prettier-response", () => {
  return { logger: loggerWithSpy };
});
