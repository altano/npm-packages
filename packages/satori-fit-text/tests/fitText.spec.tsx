/* eslint-disable react/prop-types */

import React from "react";
import { describe, it, expect } from "vitest";
import should from "./utils/makeTest";
import { getFont } from "./utils/getFont";
import { findLargestUsableFontSize } from "../src";
import { doWorkAndYield } from "@altano/tiny-async-pool";
import os from "node:os";

describe("findLargestUsableFontSize", () => {
  describe("screenshots", async () => {
    const font = await getFont();
    const lineHeight = 1;

    should("render some normal text", {
      findOptions: {
        text: `Hello I am the heading`,
        lineHeight,
        font,
        maxWidth: 800,
        maxHeight: 450,
      },
      width: 800,
      height: 450,
      Component({ fontSize, children }) {
        return (
          <body
            style={{
              margin: 0,
              padding: 0,
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "orangered",
              color: "white",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            <div style={{ fontSize: `${fontSize}px` }}>{children}</div>
          </body>
        );
      },
    });

    should("render small text", {
      findOptions: {
        text: `Hello I am the heading`,
        lineHeight,
        font,
        maxWidth: 300,
        maxHeight: 50,
      },
      width: 300,
      height: 50,
      Component({ fontSize, children }) {
        return (
          <body
            style={{
              margin: 0,
              padding: 0,
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "orangered",
              color: "white",
              fontSize: 16,
              lineHeight,
            }}
          >
            <div style={{ fontSize: `${fontSize}px` }}>{children}</div>
          </body>
        );
      },
    });

    should("render narrow text", {
      findOptions: {
        text: "just a bunch of short words for the narrow thing",
        lineHeight,
        font,
        maxWidth: 100,
        maxHeight: 600,
      },
      width: 100,
      height: 600,
      Component({ fontSize, children }) {
        return (
          <body
            style={{
              margin: 0,
              padding: 0,
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "orangered",
              color: "white",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            <div style={{ fontSize: `${fontSize}px` }}>{children}</div>
          </body>
        );
      },
    });

    should("render space under the baseline of a line with no descenders", {
      findOptions: {
        text: "A title with a final line with no descender",
        lineHeight,
        font,
        maxWidth: 1136,
        maxHeight: 429,
      },
      width: 1136,
      height: 429,
      Component({ fontSize, children }) {
        return (
          <div
            style={{
              background: "white",
              lineHeight,
              margin: 0,
              padding: 0,
              fontSize,
            }}
          >
            {children}
          </div>
        );
      },
    });

    should("have a larger size with a smaller line-height", {
      findOptions: {
        text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Similique, officia iusto quisquam deserunt pariatur ipsam dignissimos et suscipit laborum natus neque rerum nihil, ipsum hic nisi quo deleniti fugit. Exercitationem molestias placeat aspernatur veniam recusandae eum fugiat, distinctio!",
        lineHeight: 0.5,
        font,
        maxWidth: 1136,
        maxHeight: 429,
      },
      width: 1136,
      height: 429,
      Component({ fontSize, children }) {
        return (
          <div
            style={{
              background: "white",
              lineHeight: 0.5,
              margin: 0,
              padding: 0,
              fontSize,
            }}
          >
            {children}
          </div>
        );
      },
    });

    should("handle text that has a negative x in svg bbox", {
      findOptions: {
        text: "asdofi ajsdofi ajpsdofi japsodif japsoid fjapoisd jfpaoisdj fpaoisd jfpoais djfpoia sdjfpoisadf",
        font,
        lineHeight: 1.1,
        maxWidth: 1706,
        maxHeight: 506,
      },
      width: 1706,
      height: 506,
      Component({ fontSize, children }) {
        return (
          <div
            style={{
              background: "skyblue",
              lineHeight: 1.1,
              margin: 0,
              padding: 0,
              fontSize,
            }}
          >
            {children}
          </div>
        );
      },
    });

    it("should always return >= font sizes as width increases", async () => {
      const text =
        "asdofi ajsdofi ajpsdofi japsodif japsoid fjapoisd jfpaoisdj fpaoisd jfpoais djfpoia sdjfpoisadf";
      const lineHeight = 1.1;
      const maxHeight = 506;

      const widthToFontSize: Map<number, number> = new Map();

      async function testWidth(width: number): Promise<[number, number]> {
        const fontSize = await findLargestUsableFontSize({
          text,
          font,
          lineHeight,
          maxHeight,
          maxWidth: width,
        });
        return [width, fontSize];
      }

      for await (const [width, fontSize] of doWorkAndYield(
        os.cpus().length,
        [
          10, 100, 250, 500, 750, 1000, 1500, 1706, 1800, 1900, 2000, 2500,
          3000, 5000,
        ],
        testWidth,
      )) {
        widthToFontSize.set(width, fontSize);
      }

      const widthToFontSizeSorted = new Map(
        [...widthToFontSize].sort(([aWidth], [bWidth]) => {
          return aWidth < bWidth ? -1 : 0;
        }),
      );

      // Eyeball the monotonicity: every value in this map should be increasing
      expect(widthToFontSizeSorted).toMatchInlineSnapshot(`
        Map {
          10 => 1,
          100 => 18,
          250 => 41,
          500 => 62,
          750 => 75,
          1000 => 90,
          1500 => 113,
          1706 => 113,
          1800 => 113,
          1900 => 119,
          2000 => 125,
          2500 => 151,
          3000 => 151,
          5000 => 220,
        }
        `);
    });

    it("should error when maxTries = 1", async () => {
      await expect(
        findLargestUsableFontSize({
          text: "face",
          font,
          maxWidth: 100,
          maxHeight: 100,
          maxTries: 1,
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: \`maxTries\` must be >= 2]`);
    });

    it("should error after 1 try when maxTries = 2", async () => {
      await expect(
        findLargestUsableFontSize({
          text: "face",
          font,
          maxWidth: 100,
          maxHeight: 100,
          maxTries: 2,
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: Could not find a valid font size in 1 attempts. Giving up. Please try again after constraining the search space, e.g. by restricting the min/max font size difference.]`);
    });
  });
});
