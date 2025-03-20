import type { APIRoute, AstroInstance } from "astro";
import { experimental_AstroContainer } from "astro/container";
import path from "node:path";

// import { defineMiddleware } from "astro/middleware";
import satori, { type SatoriOptions } from "satori";
import { html as htmlToVNode } from "satori-html";
import he from "he";
import { getMimeType, getSvgOptions, transformImage } from "./util.js";

// import type { MiddlewareHandler, APIContext } from "astro";
// import type { ImageFormat, Filename, SvgOptions } from "./types.js";

export const GET: APIRoute = async ({
  props,
  params,
  url,
  routePattern,
  request,
  rewrite /*, ...rest*/,
}) => {
  try {
    // // @TODO don't hard-code
    // const astroTemplateUrl = request.url.replace(
    //   "opengraph-image.html",
    //   "_opengraph.png.astro",
    // );

    const strResult = await renderTemplate(params, url, routePattern, request);

    // @TODO convert strResult to SVG
    const options = await getSvgOptions();
    return convertToSVG(strResult, "png", options);
    // -----------------------------------------

    // console.log({ result, strResult });

    return new Response(strResult, {
      // status: 200,
      // statusText: "OK",
      headers: {
        "Content-Type": "text/html",
        // "Content-Length": "491",
        // "X-Astro-Noop": "true",
      },
    });

    // return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export async function renderTemplate(
  params: Record<string, string | undefined>,
  url: URL,
  routePattern: string,
  request: Request,
) {
  console.log({ params, url, routePattern, request });

  // // @TODO this isn't working, try container api
  // const opengraphTemplatePath = new URL("./_opengraph.png.astro", url);
  const targetAstroTemplatePath =
    "/src/pages" +
    url.pathname.replace(/opengraph-image.(html|png)/, "_opengraph.png.astro");
  const files2 = getOpengraphTemplates((path, getAstroInstance) => {
    console.log(
      `Checking if ${targetAstroTemplatePath} === ${path}`,
      targetAstroTemplatePath === path,
    );
    return targetAstroTemplatePath === path;
  });
  console.log({ files2 });
  const getAstroInstance = Object.values(files2)[0];
  if (getAstroInstance == null) {
    throw new Error(`Could not find astro component instance`);
  }
  const component = await getAstroInstance();
  // const files: AstroInstance[] = Object.values(
  //   // @TODO Don't hard-code
  //   import.meta.glob("/src/pages/_opengraph.png.astro", { eager: true }),
  // );
  // if (files.length !== 1) {
  //   throw new Error(`files.length = ${files.length}`);
  // }
  // const component = files[0];
  if (component == null) {
    throw new Error(`Component == null`);
  }
  const container = await experimental_AstroContainer.create();

  // @TODO This results in a 500 error and I don't know why... figure it out.
  // Likely an Astro bug.
  //
  // return container.renderToResponse(component.default, {
  //   props,
  //   params,
  // });
  //
  // // this looks just fine:
  // const response = await container.renderToResponse(component.default);
  // const responseStr = await response.text();
  // console.log({ responseStr, status: response.status, ok: response.ok });
  const strResult = await container.renderToString(component.default);
  return strResult;
}

export function getOpengraphTemplates(
  filterPredicate?: (p: string, g: () => Promise<AstroInstance>) => boolean,
): Record<string, () => Promise<AstroInstance>> {
  const files = import.meta.glob<AstroInstance>(
    "/src/pages/**/_opengraph.png.astro",
    { eager: false },
  );

  if (filterPredicate == null) {
    return files;
  }

  const filteredFiles: Record<string, () => Promise<AstroInstance>> = {};
  for (const [path, getAstroInstance] of Object.entries(files)) {
    if (filterPredicate(path, getAstroInstance)) {
      filteredFiles[path] = getAstroInstance;
    }
  }
  return filteredFiles;
}

export function getStaticPaths() {
  // const files = Object.keys(
  //   import.meta.glob("./*", { eager: false, query: "?raw" }),
  // );
  // const filesFromRoot = Object.keys(
  //   import.meta.glob("/*", { eager: false, query: "?raw" }),
  // );
  // const astroFilesFromRoot = Object.keys(
  //   import.meta.glob("/src/pages/**/*.astro", { eager: false, query: "?raw" }),
  // );
  const opengraphTemplates = Object.keys(getOpengraphTemplates());
  // console.log({
  //   imageTemplates: opengraphTemplates,
  //   files,
  //   filesFromRoot,
  //   astroFilesFromRoot,
  // });

  const paths = opengraphTemplates
    .map((template) => {
      const dir = path.dirname(template).split(path.sep);
      // console.log({ dir });
      if (dir[0] !== "" || dir[1] !== "src" || dir[2] !== "pages") {
        console.error(`Invalid template path at ${template}`);
        return null;
      }

      const restOfPath = dir.slice(3);
      return path.join(...restOfPath);
    })
    .filter((p) => p != null);

  // console.log({ paths });

  return paths.map((p) => {
    return {
      params: {
        path: p === "." ? undefined : p,
      },
    };
  });

  // return [
  //   // { params: { path: "" } },
  //   { params: { path: undefined } },
  //   { params: { path: "blog" } },
  //   { params: { path: "blog/article123" } },
  // ];
}

// async function convertSVG() {
//   const promise1 = response.text();
//   const promise2 = getSvgOptions(context, response, format);
//   const promise3 =
//     getFilename == null
//       ? defaultGetFilename(format, context)
//       : getFilename(context, response, format);
//   const [responseText, svgOptions, filename] = await Promise.all([
//     promise1,
//     promise2,
//     promise3,
//   ]);

//   // html text => vnode
//   const responseTextWithDecodedHtmlEntities = he.decode(responseText);
//   const vnode = htmlToVNode(responseTextWithDecodedHtmlEntities);

//   // vnode => svg
//   const svg = await satori(vnode as React.ReactNode, svgOptions);

//   // svg => image
//   const fileBuffer = Buffer.from(svg, "utf-8");
//   const uint8Array = new Uint8Array(
//     fileBuffer.buffer,
//     fileBuffer.byteOffset,
//     fileBuffer.byteLength,
//   );
//   const image = await transformImage(uint8Array, format);

//   return new Response(image.data, {
//     headers: {
//       "Content-Type": getMimeType(format),
//       "Content-Disposition": `inline; filename="${filename}"`,
//     },
//   });
// }

async function convertToSVG(
  responseText: string,
  format: string,
  satoriOptions: SatoriOptions,
): Promise<Response> {
  // const promise1 = response.text();
  // const promise2 = getSvgOptions(context, response, format);
  // const promise3 =
  //   getFilename == null
  //     ? defaultGetFilename(format, context)
  //     : getFilename(context, response, format);
  // const [responseText, svgOptions, filename] = await Promise.all([
  //   promise1,
  //   promise2,
  //   promise3,
  // ]);

  // html text => vnode
  const responseTextWithDecodedHtmlEntities = he.decode(responseText);
  const vnode = htmlToVNode(responseTextWithDecodedHtmlEntities);

  // vnode => svg
  const svg = await satori(vnode as React.ReactNode, satoriOptions);

  // svg => image
  const fileBuffer = Buffer.from(svg, "utf-8");
  const uint8Array = new Uint8Array(
    fileBuffer.buffer,
    fileBuffer.byteOffset,
    fileBuffer.byteLength,
  );
  const image = await transformImage(uint8Array, format);

  return new Response(image.data, {
    headers: {
      "Content-Type": getMimeType(format),
      // "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
