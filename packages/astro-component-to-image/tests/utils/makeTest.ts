import { createHtmlToImageMiddleware } from "../../src";
import { readFile } from "fs/promises";
import path from "node:path";
import { expect, test } from "vitest";
import { toMatchImageSnapshot } from "jest-image-snapshot";

import type {
  Options as MiddlewareOptions,
  SatoriOptions,
  SharpFormats,
} from "../../src";
import type {
  AstroCookies,
  APIContext,
  Params,
  Props,
  EndpointOutput,
} from "astro";

// Add image snapshot matcher to vitest
expect.extend({ toMatchImageSnapshot });
declare module "vitest" {
  interface Assertion<T> {
    toMatchImageSnapshot(): T;
  }
}

export function makeContext(url: string): APIContext {
  return {
    url: new URL(url),
    generator: "Astro v2.10.7",
    get site(): URL {
      throw new Error(`Not implemented`);
    },
    redirect: (): never => {
      throw new Error(`Not implemented`);
    },
    get locals(): Record<string, unknown> {
      throw new Error(`Not implemented`);
    },
    get request(): Request {
      throw new Error(`Not implemented`);
    },
    get clientAddress(): string {
      throw new Error(`Not implemented`);
    },
    get cookies(): AstroCookies {
      throw new Error(`Not implemented`);
    },
    get params(): Params {
      throw new Error(`Not implemented`);
    },
    get props(): Props {
      throw new Error(`Not implemented`);
    },
  };
}

async function getSatoriDefaultOptions(): Promise<SatoriOptions> {
  const interRegularBuffer = await readFile(
    path.join(__dirname, "../artifacts/fonts/Inter-Regular.ttf"),
  );
  const interBoldBuffer = await readFile(
    path.join(__dirname, "../artifacts/fonts/Inter-Bold.ttf"),
  );
  return {
    width: 300,
    height: 300,
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

export function should<Format extends SharpFormats>(
  testName: string,
  {
    requestUrl,
    format,
    extraSatoriOptions = {},
    extraMiddlewareOptions = {},
    snapshot = true,
    componentHtml,
    getComponentResponse,
    testFn,
  }: {
    requestUrl: string;
    format: Format;
    extraSatoriOptions?: Partial<SatoriOptions>;
    extraMiddlewareOptions?: Partial<MiddlewareOptions<Format>>;
    snapshot?: boolean;
    componentHtml?: string;
    getComponentResponse?: () => Promise<Response | EndpointOutput>;
    testFn?: (res: Response) => Promise<void>;
  },
): void {
  const middleware = createHtmlToImageMiddleware({
    format,
    getSharpOptions: extraMiddlewareOptions?.getSharpOptions ?? undefined,
    shouldReplace: extraMiddlewareOptions?.shouldReplace ?? undefined,
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
