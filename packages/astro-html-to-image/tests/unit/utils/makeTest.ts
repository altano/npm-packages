import { getInterPath } from "@altano/assets";
import { createHtmlToImageMiddleware } from "../../../src/index.js";
import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { createContext } from "astro/middleware";

import type {
  MiddlewareOptions,
  SvgOptions,
  ImageFormat,
} from "../../../src/index.js";
import type { APIContext } from "astro";

// Add image snapshot matcher to vitest
expect.extend({ toMatchImageSnapshot });

export function makeContext(url: string): APIContext {
  return createContext({
    request: new Request(url),
    defaultLocale: "en",
  });
}

async function getSvgDefaultOptions(): Promise<SvgOptions> {
  const interRegularBuffer = await readFile(getInterPath(400));
  const interBoldBuffer = await readFile(getInterPath(700));
  return {
    width: 300,
    height: 300,
    fonts: [
      {
        name: "Inter",
        data: interRegularBuffer,
        weight: 400,
        style: "normal",
      },
      {
        name: "Inter",
        data: interBoldBuffer,
        weight: 800,
        style: "normal",
      },
    ],
  };
}

export function should<Format extends ImageFormat>(
  testName: string,
  {
    requestUrl,
    format,
    extraSvgOptions = {},
    extraMiddlewareOptions = {},
    snapshot = true,
    componentHtml,
    getComponentResponse,
    testFn,
    testResponseFn,
  }: {
    requestUrl: string;
    format: Format;
    extraSvgOptions?: Partial<SvgOptions>;
    extraMiddlewareOptions?: Partial<MiddlewareOptions<Format>>;
    snapshot?: boolean;
    componentHtml?: string;
    getComponentResponse?: () => Promise<Response>;
    testFn?: (res: Response) => Promise<void>;
    testResponseFn?: (res: Response) => Promise<void>;
  },
): void {
  const middleware = createHtmlToImageMiddleware({
    format,
    shouldReplace: extraMiddlewareOptions?.shouldReplace ?? undefined,
    async getSvgOptions() {
      const defaults = await getSvgDefaultOptions();
      return {
        ...defaults,
        ...extraSvgOptions,
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
      throw new Error(`Response was unexpectedly nullish`);
    }

    if (!(response instanceof Response)) {
      if (testFn) {
        await testFn(response);
      }
    } else {
      expect(response.status).equal(200);
      expect(response.ok).toBeTruthy();

      if (snapshot) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        expect(buffer).toMatchImageSnapshot({ runInProcess: true });
      }

      if (testResponseFn) {
        await testResponseFn(response);
      }
    }
  }

  test(testName, run);
}

export const middleware = {
  should,
};
