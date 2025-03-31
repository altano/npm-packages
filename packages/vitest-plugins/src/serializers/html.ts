import prettier from "@prettier/sync";
import prettierConfig from "./.prettierrc.json" with { type: "json" };
import type { Options } from "prettier";
import type { SnapshotSerializer } from "vitest";

const htmlPattern = /^(<html|<!doctype)/gi;

/**
 * Prettier format html
 */
function formatHtml(unformattedHtml: string): string {
  try {
    const formattedHtml = prettier
      .format(unformattedHtml, {
        filepath: "index.html",
        ...(prettierConfig as Options),
      })
      .trim();
    return `<!-- Formatted HTML -->
${formattedHtml}`;
  } catch (e: unknown) {
    // Prettier can't parse this text as html. That's fine, pass it through
    // unformatted.
    return unformattedHtml;
  }
}

const serializer: SnapshotSerializer = {
  serialize(val: string, config, indentation, depth, refs, printer) {
    const formattedHtml = formatHtml(val);
    // Wrap the text to prevent infinite recursion
    return printer(formattedHtml, config, indentation, depth, refs);
  },
  test(val) {
    return typeof val === "string" && htmlPattern.test(val);
  },
};

export default serializer;
