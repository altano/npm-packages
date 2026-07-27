import {
  afterEach,
  describe,
  expect,
  it,
  vi,
  type DeeplyAllowMatchers,
} from "vitest";
import prettierResponse from "../../src/index.js";
import { virtualConfigPlugin } from "../../src/integration.js";
import type {
  AstroConfig,
  AstroIntegration,
  BaseIntegrationHooks,
} from "astro";
import { loggerWithSpy } from "./utils/setup.js";

type AstroConfigSetupOptions = Parameters<
  BaseIntegrationHooks["astro:config:setup"]
>[0];
type UpdateConfig = AstroConfigSetupOptions["updateConfig"];

const makeConfig = (
  updateConfigSpy: UpdateConfig,
  partialConfig: Partial<AstroConfig>,
): AstroConfigSetupOptions =>
  ({
    config: {
      output: "static",
      integrations: [] as AstroIntegration[],
      ...partialConfig,
    } as AstroConfig,
    command: "build",
    isRestart: false,
    updateConfig: updateConfigSpy,
    addRenderer: () => {
      throw new Error(`not impl`);
    },
    addWatchFile: () => {
      throw new Error(`not impl`);
    },
    injectScript: () => {
      throw new Error(`not impl`);
    },
    injectRoute: () => {
      throw new Error(`not impl`);
    },
    addClientDirective: () => {
      throw new Error(`not impl`);
    },
    addDevToolbarApp: () => {
      throw new Error(`not impl`);
    },
    addMiddleware: () => {
      /* ignore */
    },
    createCodegenDir: () => {
      throw new Error(`not impl`);
    },
    logger: loggerWithSpy,
  }) as const;

describe("integration", async () => {
  afterEach(() => {
    vi.resetAllMocks();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.info).not.toHaveBeenCalled();
  });

  it("should update all config options", async () => {
    const updateConfig = vi.fn<UpdateConfig>();
    const integration = prettierResponse({
      disableMinifiers: true,
    });
    await integration.hooks["astro:config:setup"]?.(
      makeConfig(updateConfig, {}),
    );

    expect(updateConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        compressHTML: false,
      }),
    );
    expect(updateConfig).toHaveBeenCalledWith(
      objectContaining({
        vite: objectContaining({
          build: objectContaining({
            minify: false,
          }),
        }),
      }),
    );
    expect(updateConfig).toHaveBeenCalledWith(
      objectContaining({
        vite: objectContaining({
          build: objectContaining({
            cssMinify: false,
          }),
        }),
      }),
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.info).toHaveBeenCalledWith(
      expect.stringContaining("Disabling minification of html/css/js"),
    );
  });

  it("should update all config options", async () => {
    const updateConfig = vi.fn<UpdateConfig>();
    const integration = prettierResponse({
      disableMinifiers: true,
    });
    const config = makeConfig(updateConfig, {
      vite: {
        build: {},
      },
    });
    await integration.hooks["astro:config:setup"]?.(config);

    expect(updateConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        compressHTML: false,
      }),
    );
    expect(updateConfig).toHaveBeenCalledWith(
      objectContaining({
        vite: objectContaining({
          build: objectContaining({
            minify: false,
          }),
        }),
      }),
    );
    expect(updateConfig).toHaveBeenCalledWith(
      objectContaining({
        vite: objectContaining({
          build: objectContaining({
            cssMinify: false,
          }),
        }),
      }),
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.info).toHaveBeenCalledWith(
      expect.stringContaining("Disabling minification of html/css/js"),
    );
  });

  it("should not update config when disabled", async () => {
    const updateConfig = vi.fn<UpdateConfig>();
    const integration = prettierResponse({
      disableMinifiers: false,
    });
    const config = makeConfig(updateConfig, {
      vite: {
        build: {},
      },
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.info).not.toHaveBeenCalled();
    await integration.hooks["astro:config:setup"]?.(config);

    expect(updateConfig).not.toHaveBeenCalledWith(
      expect.objectContaining({
        compressHTML: anything(),
      }),
    );
    expect(updateConfig).not.toHaveBeenCalledWith(
      objectContaining({
        vite: objectContaining({
          build: objectContaining({
            minify: anything(),
          }),
        }),
      }),
    );
    expect(updateConfig).not.toHaveBeenCalledWith(
      objectContaining({
        vite: objectContaining({
          build: objectContaining({
            cssMinify: anything(),
          }),
        }),
      }),
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.info).not.toHaveBeenCalledWith(
      expect.stringContaining("Disabling minification of html/css/js"),
    );
  });

  it("should not update config when unnecessary", async () => {
    const updateConfig = vi.fn<UpdateConfig>();
    const integration = prettierResponse({
      disableMinifiers: true, // we SHOULD disable minification
    });
    const config = makeConfig(updateConfig, {
      // but our astro config already disables it
      vite: {
        build: {
          minify: false,
          cssMinify: false,
        },
        environments: {
          client: {
            build: {
              minify: false,
            },
          },
        },
      },
      compressHTML: false,
    });

    await integration.hooks["astro:config:setup"]?.(config);

    expect(updateConfig).not.toHaveBeenCalledWith(
      expect.objectContaining({
        compressHTML: anything(),
      }),
    );
    expect(updateConfig).not.toHaveBeenCalledWith(
      objectContaining({
        vite: objectContaining({
          build: objectContaining({
            minify: anything(),
          }),
        }),
      }),
    );
    expect(updateConfig).not.toHaveBeenCalledWith(
      objectContaining({
        vite: objectContaining({
          build: objectContaining({
            cssMinify: anything(),
          }),
        }),
      }),
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(loggerWithSpy.info).not.toHaveBeenCalledWith(
      expect.stringContaining("Disabling minification of html/css/js"),
    );
  });
});

describe("virtualConfigPlugin", () => {
  const VIRTUAL_MODULE_ID = "virtual:astro-prettier-response/config";
  const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

  it("resolves and loads the virtual config module", () => {
    const contents = `export default ${JSON.stringify({ formatXml: true })}`;
    const plugin = virtualConfigPlugin(contents);

    expect(plugin.resolveId(VIRTUAL_MODULE_ID)).toBe(
      RESOLVED_VIRTUAL_MODULE_ID,
    );
    expect(plugin.load(RESOLVED_VIRTUAL_MODULE_ID)).toBe(contents);
  });

  it("ignores unrelated module ids", () => {
    const plugin = virtualConfigPlugin("export default {}");

    expect(plugin.resolveId("some-other-module")).toBeUndefined();
    expect(plugin.load("some-other-module")).toBeUndefined();
  });
});

// Wrap vitest types with unknown to prevent valid unsafe assignment errors.
//
// See https://github.com/vitest-dev/vitest/issues/7015
function objectContaining<T = unknown>(
  expected: DeeplyAllowMatchers<T>,
): unknown {
  return expect.objectContaining(expected);
}

function anything(): unknown {
  return expect.anything() as unknown;
}
