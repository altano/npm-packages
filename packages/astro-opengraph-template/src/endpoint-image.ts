import type { APIRoute, LocalImageService } from "astro";
import { experimental_AstroContainer } from "astro/container";
import path from "node:path";

// import { defineMiddleware } from "astro/middleware";
import satori, { type SatoriOptions } from "satori";
import { html as htmlToVNode } from "satori-html";
import he from "he";
import { getMimeType, transformImage } from "./util.js";
import { getOpengraphTemplates } from "./getOpengraphTemplates.js";
import { getResolvedConfig } from "./config.js";

// import type { MiddlewareHandler, APIContext } from "astro";
// import type { ImageFormat, Filename, SvgOptions } from "./types.js";

export const GET: APIRoute = async ({
  locals,
  params,
  props,
  request,
  routePattern,
  url,
  isPrerendered,
}) => {
  console.log(`GET endpoint-image.ts`, {
    isPrerendered,
    locals,
    params,
    props,
    routePattern,
    url,
    request,
  });

  const strResult = await renderTemplate(params, url);

  // TODO convert strResult to SVG
  const { svgOptions } = await getResolvedConfig();
  // console.log({ svgOptions });
  const png = await convertToPNG(strResult, "png", svgOptions);

  return new Response(png.data, {
    headers: {
      "Content-Type": getMimeType(png.format),
    },
  });
};

export async function renderTemplate(
  params: Record<string, string | undefined>,
  url: URL,
  // routePattern: string,
  // request: Request,
): Promise<string> {
  // console.log({ params, url, routePattern, request });

  debugger;

  // // TODO this isn't working, try container api
  // const opengraphTemplatePath = new URL("./_opengraph.png.astro", url);

  //----------------------------
  const targetAstroTemplatePath =
    "/src/pages" +
    url.pathname.replace(/opengraph-image.(html|png)/, "_opengraph.png.astro");
  const files2 = getOpengraphTemplates((path) => {
    console.log(
      `\nChecking if ${targetAstroTemplatePath} === ${path}`,
      targetAstroTemplatePath === path,
    );
    return targetAstroTemplatePath === path;
  });
  // console.log({ files2 });
  const getAstroInstance = Object.values(files2)[0];
  if (getAstroInstance == null) {
    throw new Error(`Could not find astro component instance`);
  }
  //----------------------------
  // const getAstroInstance = Object.values(files2)[0];
  // if (getAstroInstance == null) {
  //   throw new Error(`Could not find astro component instance`);
  // }

  // const component = await getAstroInstance();

  // const files: AstroInstance[] = Object.values(
  //   // TODO Don't hard-code
  //   import.meta.glob("/src/pages/_opengraph.png.astro", { eager: true }),
  // );
  // if (files.length !== 1) {
  //   throw new Error(`files.length = ${files.length}`);
  // }
  // const component = files[0];
  // if (getAstroInstance == null) {
  //   throw new Error(`Component == null`);
  // }
  const container = await experimental_AstroContainer.create();

  // TODO This results in a 500 error and I don't know why... figure it out.
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
  const astroInstance = await getAstroInstance();
  const strResult = await container.renderToString(astroInstance.default, {
    params,
  });
  return strResult;
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

async function convertToPNG(
  responseText: string,
  format: string,
  satoriOptions: SatoriOptions,
): Promise<ReturnType<LocalImageService["transform"]>> {
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

  return image;
}

type ParamsEntry = {
  params: {
    slug: string | undefined;
    path: string | undefined;
  };
};

// TODO the endpoint's getStaticPaths can only return static paths if the
// _opengraph.png.astro exports it. Otherwise it has to be dynamic and support
// fully dynamic loads.
export function getStaticPaths(): ParamsEntry[] {
  // return [
  //   { params: { slug: undefined, path: undefined } },
  //   { params: { slug: "hello-world", path: "posts" } },
  //   { params: { slug: "bye-cruel-world", path: "posts" } },
  // ];

  // const files = Object.keys(
  //   import.meta.glob("./*", { eager: false, query: "?raw" }),
  // );
  // const filesFromRoot = Object.keys(
  //   import.meta.glob("/*", { eager: false, query: "?raw" }),
  // );
  // const astroFilesFromRoot = Object.keys(
  //   import.meta.glob("/src/pages/**/*.astro", { eager: false, query: "?raw" }),
  // );
  debugger;
  const opengraphTemplates = getOpengraphTemplates();
  // console.log({
  //   imageTemplates: opengraphTemplates,
  //   files,
  //   filesFromRoot,
  //   astroFilesFromRoot,
  // });

  // TODO paths is wrong here. I need it to just be the `getStaticPaths()` from
  // the corresponding _opengraph.png.astro file, but I don't know what
  // corresponds here. we get no arguments to figure that out.
  console.log(new Error().stack);

  const paths = Object.entries(opengraphTemplates)
    .flatMap(([_templatePath, getAstroInstance]) => {
      const staticPathsFromModule = (() => {
        // return null;

        return null;

        // const astroInstance = await getAstroInstance();
        // // @ts-expect-error face
        // if (astroInstance.getStaticPaths == null) {
        //   return null;
        // } else {
        //   // @ts-expect-error face
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        //   const staticPathsFromModule = astroInstance.getStaticPaths();
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-console
        //   console.log({ staticPathsFromModule });
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        //   return staticPathsFromModule as ParamsEntry[];
        // }
      })();

      if (staticPathsFromModule) {
        return staticPathsFromModule;
      } else {
        return [];
      }

      // const dir = path.dirname(templatePath).split(path.sep);
      // // console.log({ dir });
      // // assert it starts with ["", "src", "pages"]:
      // if (dir[0] !== "" || dir[1] !== "src" || dir[2] !== "pages") {
      //   throw new Error(`Invalid template path at ${templatePath}`);
      // }
      // // then skip the ["", "src", "pages"]
      // const restOfPath = dir.slice(3);
      // // restOfPath.push("opengraph-image.png");
      // const thisPath = path.join(...restOfPath);
      // if (staticPathsFromModule) {
      //   return staticPathsFromModule.map((staticPathFromModule) => {
      //     return {
      //       ...staticPathFromModule,
      //       params: {
      //         ...staticPathFromModule.params,
      //         path: thisPath === "." ? undefined : thisPath,
      //       },
      //     };
      //   });
      // } else {
      //   return {
      //     params: {
      //       slug: undefined,
      //       path: thisPath === "." ? undefined : thisPath,
      //     },
      //   };
      // }
    })
    .filter((p) => p != null);

  // console.log({ paths });

  console.dir({ opengraphTemplates, staticPaths: JSON.stringify(paths) });

  return paths;
  // return staticPaths;

  // return [
  //   // { params: { path: "" } },
  //   { params: { path: undefined } },
  //   { params: { path: "blog" } },
  //   { params: { path: "blog/article123" } },
  // ];
}
