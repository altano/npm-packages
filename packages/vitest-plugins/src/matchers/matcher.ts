import type { expect } from "vitest";

type MatchersObject = Parameters<typeof expect.extend>[0];

export type Matcher = MatchersObject[keyof MatchersObject];
