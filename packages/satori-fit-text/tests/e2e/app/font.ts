import type { Font } from "@altano/satori-fit-text";
import Inter100 from "@fontsource/inter/files/inter-latin-100-normal.woff";
import Inter200 from "@fontsource/inter/files/inter-latin-200-normal.woff";
import Inter300 from "@fontsource/inter/files/inter-latin-300-normal.woff";
import Inter400 from "@fontsource/inter/files/inter-latin-400-normal.woff";
import Inter500 from "@fontsource/inter/files/inter-latin-500-normal.woff";
import Inter600 from "@fontsource/inter/files/inter-latin-600-normal.woff";
import Inter700 from "@fontsource/inter/files/inter-latin-700-normal.woff";
import Inter800 from "@fontsource/inter/files/inter-latin-800-normal.woff";
import Inter900 from "@fontsource/inter/files/inter-latin-900-normal.woff";

type Weight = NonNullable<Font["weight"]>;

function getURL(weight: Weight): string {
  switch (weight) {
    case 100:
      return Inter100;
    case 200:
      return Inter200;
    case 300:
      return Inter300;
    case 400:
      return Inter400;
    case 500:
      return Inter500;
    case 600:
      return Inter600;
    case 700:
      return Inter700;
    case 800:
      return Inter800;
    case 900:
      return Inter900;
  }
}

export async function getInter(weight: Weight): Promise<Font> {
  const url = getURL(weight);
  const buffer = await fetch(url).then((res) => res.arrayBuffer());
  return {
    name: "Inter",
    data: buffer,
    weight,
  };
}
