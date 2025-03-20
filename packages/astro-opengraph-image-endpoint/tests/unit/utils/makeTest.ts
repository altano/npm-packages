import type { APIContext } from "astro";
import { createContext } from "astro/middleware";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { expect, test, vi } from "vitest";
import { createOpenGraphImageMiddleware } from "../../../src/createOpenGraphImageMiddleware.js";
import type { OpengraphImageConfigSerializable } from "../../../src/integration.js";
import { getDefaultSvgOptions } from "./setup.js";
import type { ImageFormat } from "@altano/astro-html-to-image";

// Add image snapshot matcher to vitest
expect.extend({ toMatchImageSnapshot });

export function makeContext(url: string): APIContext {
  return createContext({
    request: new Request(url),
    defaultLocale: "en",
  });
}

const userConfigMockModule = vi.hoisted(() =>
  vi.fn((): OpengraphImageConfigSerializable => {
    throw new Error(`Mock user config was used without first setting a value.`);
  }),
);

vi.mock("virtual:opengraph-image/user-config", async () => {
  return {
    default: userConfigMockModule,
  };
});

async function withMockedUserConfig(
  svgOptionsOverrides: Partial<OpengraphImageConfigSerializable["svgOptions"]>,
  callback: () => Promise<void>,
): Promise<void> {
  const defaultSvgOptions = getDefaultSvgOptions();
  const svgOptions = {
    ...defaultSvgOptions,
    ...svgOptionsOverrides,
  } as const;
  const value = {
    svgOptions: {
      ...svgOptions,
    },
  };
  userConfigMockModule.mockReturnValue(value);

  try {
    await callback();
  } finally {
    userConfigMockModule.mockRestore();
  }
}

// TODO de-dup with other makeTest.ts
export function should<Format extends ImageFormat>(
  testName: string,
  {
    requestUrl,
    extraSvgOptions = {},
    snapshot = true,
    componentHtml,
    getComponentResponse,
    testFn,
    testResponseFn,
  }: {
    requestUrl: string;
    format: Format;
    extraSvgOptions?: Parameters<typeof withMockedUserConfig>[0];
    snapshot?: boolean;
    componentHtml?: string;
    getComponentResponse?: () => Promise<Response>;
    testFn?: (res: Response) => Promise<void>;
    testResponseFn?: (res: Response) => Promise<void>;
  },
): void {
  test(testName, async () => {
    // Mock the virtual module for each test
    await withMockedUserConfig(extraSvgOptions, async () => {
      // Create the middleware (that uses the user config above)
      const middlewarePromise = createOpenGraphImageMiddleware();

      const next = async (): Promise<Response> => {
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

      const middleware = await middlewarePromise;
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
    });
  });
}

export const middleware = {
  should,
};
