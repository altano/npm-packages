import type { AstroInstance } from "astro";

type AstroInstanceGetter = () => Promise<AstroInstance>;

export function getOpengraphTemplates(
  filterPredicate?: (p: string, g: AstroInstanceGetter) => boolean,
): Record<string, AstroInstanceGetter> {
  const files = import.meta.glob<AstroInstance>(
    "/src/pages/**/_opengraph.png.astro",
    { eager: false },
  );

  if (filterPredicate == null) {
    return files;
  }

  const filteredFiles: Record<string, AstroInstanceGetter> = {};
  for (const [path, astroInstance] of Object.entries(files)) {
    if (filterPredicate(path, astroInstance)) {
      filteredFiles[path] = astroInstance;
    }
  }

  console.log(
    `[getOpengraphTemplates] Found: \n${Object.keys(files).join(",\n")} \nand filtered down to: \n${Object.keys(filteredFiles).join(",\n")}`,
  );

  return filteredFiles;
}
