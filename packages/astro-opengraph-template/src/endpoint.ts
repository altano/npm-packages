import type { APIRoute, LocalImageService } from "astro";
import { experimental_AstroContainer } from "astro/container";
import satori, { type SatoriOptions } from "satori";
import { html as htmlToVNode } from "satori-html";
import he from "he";
import { getMimeType, transformImage } from "./util.js";
import { getResolvedConfig } from "./config.js";
import { isAstroComponentFactory } from "astro/runtime/server/render/astro/factory.js";
import type { SvgOptions } from "./types.js";

type Options = {
  // We don't just type this as `AstroComponentFactory` because astro typing is
  // hard to get right and simply importing a .astro file doesn't give you
  // something typed as a factory.
  template: unknown;
  svgOptionOverrides?: Partial<SvgOptions>;
};

// export async function makeOpengraphDevEndpoint({ template }: Options): Promise<APIRoute> {
export function makeOpengraphDevEndpoint({ template }: Options): APIRoute {
  return async ({ locals, params, props, request }) => {
    const config = await getResolvedConfig();
    if (config.command !== "dev") {
      return new Response(null, { status: 404 });
    }

    if (!isAstroComponentFactory(template)) {
      throw new Error(`Given is not an Astro template.`);
    }

    const container = await experimental_AstroContainer.create();
    const templateStr = await container.renderToString(template, {
      partial: false,
      request,
      params,
      locals,
      props,
    });

    return new Response(templateStr, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  };
}

export function makeOpengraphEndpoint({
  template,
  svgOptionOverrides,
}: Options): APIRoute {
  return async ({ locals, params, props, request }) => {
    if (!isAstroComponentFactory(template)) {
      throw new Error(`Given is not an Astro template.`);
    }

    const container = await experimental_AstroContainer.create();
    const templateStr = await container.renderToString(template, {
      partial: false,
      request,
      params,
      locals,
      props,
    });

    const config = await getResolvedConfig();
    const svgOptions = {
      ...config.svgOptions,
      ...svgOptionOverrides,
    };
    const png = await convertToPNG(templateStr, "png", svgOptions);

    return new Response(png.data, {
      headers: {
        "Content-Type": getMimeType(png.format),
      },
    });
  };
}

async function convertToPNG(
  responseText: string,
  format: string,
  satoriOptions: SatoriOptions,
): Promise<ReturnType<LocalImageService["transform"]>> {
  // html text => vnode
  const responseTextWithDecodedHtmlEntities = he.decode(responseText);
  const vnode = htmlToVNode(responseTextWithDecodedHtmlEntities);

  // vnode => svg
  const svg = await satori(vnode as React.ReactNode, satoriOptions);

  // svg => buffer
  const fileBuffer = Buffer.from(svg, "utf-8");
  const uint8Array = new Uint8Array(
    fileBuffer.buffer,
    fileBuffer.byteOffset,
    fileBuffer.byteLength,
  );

  // buffer => transformed png
  return transformImage(uint8Array, format);
}
