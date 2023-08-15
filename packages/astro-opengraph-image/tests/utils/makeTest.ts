import { createOpenGraphImageMiddleware } from "../../src";
import { readFile } from "fs/promises";
import path from "node:path";
import { expect, test } from "vitest";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { createContext } from "astro/middleware";

import type { SatoriOptions } from "@altano/astro-html-to-image";
import type { APIContext, EndpointOutput } from "astro";
import type { ImageFormat } from "../../src/createImageMiddleware";

// Add image snapshot matcher to vitest
expect.extend({ toMatchImageSnapshot });
declare module "vitest" {
  interface Assertion<T> {
    toMatchImageSnapshot(): T;
  }
}

export function makeContext(url: string): APIContext {
  return createContext({ request: new Request(url) });
}

async function getSatoriDefaultOptions(): Promise<
  Pick<SatoriOptions, "fonts">
> {
  const interRegularBuffer = await readFile(
    path.join(
      __dirname,
      "../../../astro-html-to-image/tests/artifacts/fonts/Inter-Regular.ttf",
    ),
  );
  const interBoldBuffer = await readFile(
    path.join(
      __dirname,
      "../../../astro-html-to-image/tests/artifacts/fonts/Inter-Bold.ttf",
    ),
  );
  return {
    fonts: [
      {
        name: "Inter Variable",
        data: interRegularBuffer,
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter Variable",
        data: interBoldBuffer,
        weight: 800,
        style: "normal",
      },
    ],
  };
}

// TODO Maybe de-dup with other makeTest.ts?
export function should<Format extends ImageFormat>(
  testName: string,
  {
    requestUrl,
    extraSatoriOptions = {},
    snapshot = true,
    componentHtml,
    getComponentResponse,
    testFn,
  }: {
    requestUrl: string;
    format: Format;
    extraSatoriOptions?: Partial<SatoriOptions>;
    snapshot?: boolean;
    componentHtml?: string;
    getComponentResponse?: () => Promise<Response | EndpointOutput>;
    testFn?: (res: Response) => Promise<void>;
  },
): void {
  const middleware = createOpenGraphImageMiddleware({
    async getSatoriOptions() {
      const defaults = await getSatoriDefaultOptions();
      return {
        ...defaults,
        ...extraSatoriOptions,
      };
    },
  });

  async function run(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next = async (): Promise<any> => {
      if (componentHtml) {
        return new Response(componentHtml, {
          status: 200,
          headers: {
            "Content-Type": "text/html",
          },
        });
      } else if (getComponentResponse) {
        return getComponentResponse();
      } else {
        throw new Error(
          `Must provide either componentHtml or getComponentResponse`,
        );
      }
    };

    const response = await middleware(makeContext(requestUrl), next);

    expect(response).toBeDefined();

    if (response == null) {
      throw new Error(`${response} was undefined`);
    }

    expect(response.status).equal(200);
    expect(response.ok).toBeTruthy();

    if (snapshot) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      expect(buffer).toMatchImageSnapshot({ runInProcess: true });
    }

    if (testFn) {
      await testFn(response);
    }
  }

  test(testName, run);
}

export const middleware = {
  should,
};
