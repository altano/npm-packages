import React from "react";
import {
  type FindOptions,
  findLargestUsableFontSize,
} from "../../../src/index.js";
import { expect, test } from "vitest";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// Add image snapshot matcher to vitest
expect.extend({ toMatchImageSnapshot });

type TestComponent = React.ComponentType<{
  fontSize: number;
  children: React.ReactNode;
}>;

type TestOptions = {
  snapshot?: boolean;
  findOptions: FindOptions;
  Component: TestComponent;
  only?: boolean;
};

export default function should(
  testName: string,
  { snapshot = true, Component, findOptions, only = false }: TestOptions,
): void {
  async function run(): Promise<void> {
    const fontSize = await findLargestUsableFontSize(findOptions);

    if (snapshot) {
      const node = (
        <Component fontSize={fontSize}>{findOptions.text}</Component>
      );

      // vnode => svg
      const svg = await satori(node, {
        fonts: [findOptions.font],
        width: findOptions.maxWidth,
        height: findOptions.maxHeight,
        debug: true,
      });

      // svg => image
      const imageResvgArr = new Resvg(svg, {
        textRendering: 1, // optimizeLegibility
        imageRendering: 0, // optimizeQuality
      })
        .render()
        .asPng();
      const imageBuffer = Buffer.from(imageResvgArr);

      expect(imageBuffer).toMatchImageSnapshot({ runInProcess: true });
    }
  }

  test(testName, { only }, run);
}
