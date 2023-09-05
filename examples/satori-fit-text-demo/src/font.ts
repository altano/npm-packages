import type { Font } from "@altano/satori-fit-text";

const urlMap = {
  100: "https://rsms.me/inter/font-files/Inter-Thin.woff",
  200: "https://rsms.me/inter/font-files/Inter-ExtraLight.woff",
  300: "https://rsms.me/inter/font-files/Inter-Light.woff",
  400: "https://rsms.me/inter/font-files/Inter-Regular.woff",
  500: "https://rsms.me/inter/font-files/Inter-Medium.woff",
  600: "https://rsms.me/inter/font-files/Inter-SemiBold.woff",
  700: "https://rsms.me/inter/font-files/Inter-Bold.woff",
  800: "https://rsms.me/inter/font-files/Inter-ExtraBold.woff",
  900: "https://rsms.me/inter/font-files/Inter-Black.woff",
} as const;

type Weight = NonNullable<Font["weight"]>;

const fontCache = new Map<Weight, Font>();

export async function getInter(weight: Weight): Promise<Font> {
  {
    const font = fontCache.get(weight);
    if (font != null) {
      return font;
    }
  }

  const url = urlMap[weight];
  if (url == null) {
    throw new Error(`Unexpected weight: ${weight}`);
  }

  const buffer = await fetch(url).then((res) => res.arrayBuffer());
  const font = {
    name: "Inter",
    data: buffer,
    weight,
  } as const;

  fontCache.set(weight, font);

  return font;
}
