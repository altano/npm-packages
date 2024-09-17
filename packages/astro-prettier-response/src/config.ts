import { z } from "astro/zod";

export const ConfigSchema: z.ZodDefault<
  z.ZodOptional<
    z.ZodObject<
      {
        disableMinifiers: z.ZodDefault<z.ZodBoolean>;
        formatXml: z.ZodDefault<z.ZodBoolean>;
      },
      "strict",
      z.ZodTypeAny,
      {
        disableMinifiers: boolean;
        formatXml: boolean;
      },
      {
        disableMinifiers?: boolean | undefined;
        formatXml?: boolean | undefined;
      }
    >
  >
> = z
  .object({
    /**
     * Astro/Vite will minify your HTML/JS/CSS by default. Astro lightly
     * compresses your HTML (not a full minifier) while Vite will fully compress
     * your CSS/JS. Since we're going for prettiest output here, it makes sense
     * for this integration to fully disable such minification.
     *
     * If you set this to false, and you use the default Astro config with
     * minification enabled, you will still get your output formatted by
     * Prettier, but it will be minified output that is formatted. So, for
     * example, most of the variable names in your JS will be one character
     * letters.
     *
     * @defaultValue true
     */
    disableMinifiers: z.boolean().default(true),
    /**
     * Install `@prettier/plugin-xml` package if you enable this
     *
     * Use the official Prettier plugin to format xml as well. Sitemaps and rss
     * feeds are xml, so this would probably do something on your stock Astro
     * site. Note: the Prettier output is only marginally better because xml is
     * very whitespace sensitive and so Prettier's formatting is very strict and
     * not that much prettier.
     *
     * @defaultValue false
     */
    formatXml: z.boolean().default(false),
  })
  .strict()
  .optional()
  .default({});

export type AstroPrettierResponseConfig = z.infer<typeof ConfigSchema>;
