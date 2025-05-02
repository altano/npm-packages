import type { loadFixture } from "@inox-tools/astro-tests/astroFixture";

export type Fixture = Awaited<ReturnType<typeof loadFixture>>;
