import type { Font } from "@altano/satori-fit-text";

const urlMap = {
  100: "https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-Thin.otf",
  200: "https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-ExtraLight.otf",
  300: "https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-Light.otf",
  400: "https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-Regular.otf",
  500: "https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-Medium.otf",
  600: "https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-SemiBold.otf",
  700: "https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-Bold.otf",
  800: "https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-ExtraBold.otf",
  900: "https://files.terriblefish.com/fonts/Inter/v4/extras/otf/Inter-Black.otf",
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
