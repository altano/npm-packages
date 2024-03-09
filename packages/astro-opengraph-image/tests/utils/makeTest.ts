import type { APIContext, EndpointOutput } from "astro";
import { createContext } from "astro/middleware";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { expect, test, vi } from "vitest";
import type { ImageFormat } from "../../src/createOpenGraphImageMiddleware";
import { createOpenGraphImageMiddleware } from "../../src/createOpenGraphImageMiddleware";
import type { OpengraphImageConfigSerializable } from "../../src/integration";
import { getDefaultSvgOptions } from "./setup";

// Add image snapshot matcher to vitest
expect.extend({ toMatchImageSnapshot });

export function makeContext(url: string): APIContext {
  return createContext({ request: new Request(url) });
}

const userConfigMock = vi.hoisted(() => ({
  default: vi.fn(),
}));

function mockUserConfig(
  svgOptionsOverrides?: Partial<OpengraphImageConfigSerializable["svgOptions"]>,
): void {
  const defaultSvgOptions = getDefaultSvgOptions();
  const svgOptions = {
    ...defaultSvgOptions,
    ...(svgOptionsOverrides ?? {}),
  };
  userConfigMock.default.mockReturnValueOnce({
    svgOptions: {
      ...svgOptions,
    },
  } satisfies OpengraphImageConfigSerializable);
}

vi.mock("virtual:opengraph-image/user-config", async () => {
  return {
    default: userConfigMock.default,
  };
});

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
    extraSvgOptions?: Parameters<typeof mockUserConfig>[0];
    snapshot?: boolean;
    componentHtml?: string;
    getComponentResponse?: () => Promise<Response | EndpointOutput>;
    testFn?: (res: Response | EndpointOutput) => Promise<void>;
    testResponseFn?: (res: Response) => Promise<void>;
  },
): void {
  // Mock the virtual module for each test
  mockUserConfig(extraSvgOptions);

  // Create the middleware (that uses the user config above)
  const middleware = createOpenGraphImageMiddleware();

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
