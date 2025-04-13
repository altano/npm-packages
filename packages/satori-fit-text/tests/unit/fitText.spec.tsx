import { describe, it, expect, afterEach } from "vitest";
import should from "./utils/makeTest.js";
import { getFont } from "./utils/getFont.js";
import { findLargestUsableFontSize } from "../../src/index.js";

describe("findLargestUsableFontSize", async () => {
  const font = await getFont();
  const lineHeight = 1;

  afterEach(async () => {
    // https://github.com/vitest-dev/vitest/issues/4497#issuecomment-1887757764
    await new Promise((res) => setImmediate(res));
  });

  describe("screenshots", async () => {
    should("render some normal text", {
      findOptions: {
        text: `Hello I am the heading`,
        lineHeight,
        font,
        maxWidth: 800,
        maxHeight: 450,
      },
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
  });

  describe("misc", async () => {
    it.each([
      10, 100, 250, 500, 750, 1000, 1500, 1706, 1800, 1900, 2000, 2500, 3000,
      5000,
    ])(
      "should always return >= font sizes as width increases, width=%d",
      async (width) => {
        const text =
          "asdofi ajsdofi ajpsdofi japsodif japsoid fjapoisd jfpaoisdj fpaoisd jfpoais djfpoia sdjfpoisadf";
        const lineHeight = 1.1;
        const maxHeight = 506;
        const fontSize = await findLargestUsableFontSize({
          text,
          font,
          lineHeight,
          maxHeight,
          maxWidth: width,
        });

        // Eyeball the monotonicity in the .snap file: every value should be
        // >= the previous value
        expect(fontSize).toMatchSnapshot();
      },
    );

    it("should error when maxTries = 1", async () => {
      await expect(
        findLargestUsableFontSize({
          text: "face",
          font,
          maxWidth: 100,
          maxHeight: 100,
          maxTries: 1,
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: \`maxTries\` must be >= 2]`,
      );
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
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Could not find a valid font size in 1 attempts. Giving up. Please try again after constraining the search space, e.g. by restricting the min/max font size difference.]`,
      );
    });
  });

  describe("varying font weight", async () => {
    const text = `asdofi ajsdofi ajpsdofi japsodif japsoid fjapoisd jfpaoisdj fpaoisd jfpoais djfpoia sdjfpoisadf`;
    const maxWidth = 810;
    const maxHeight = 335;
    const minFontSize = 50;
    const maxFontSize = 100;

    it("fit bigger text with a light weight", async () => {
      const fontSize = await findLargestUsableFontSize({
        text,
        lineHeight,
        maxHeight,
        maxWidth,
        minFontSize,
        maxFontSize,
        font: await getFont(100),
      });

      expect(fontSize).toBe(75);
    });

    it("fit smaller text with a heavy weight", async () => {
      const fontSize = await findLargestUsableFontSize({
        text,
        lineHeight,
        maxHeight,
        maxWidth,
        minFontSize,
        maxFontSize,
        font: await getFont(900),
      });

      expect(fontSize).toBe(66);
    });
  });
});
