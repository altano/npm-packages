import sharp from "sharp";
import type { LocalImageService } from "astro";

export const MockImageService = {
  async getConfiguredImageService(): Promise<LocalImageService> {
    return {
      async transform(
        inputBuffer,
        transform,
        _imageConfig,
      ): Promise<{ data: Buffer; format: "png" }> {
        const format = transform["format"];
        if (format !== "png") {
          throw new Error(`Unsupported image format: ${transform["format"]}`);
        }
        const data = await sharp(inputBuffer).png().toBuffer();
        return {
          data: data,
          format: "png",
        };
      },
      parseURL(_url, _imageConfig): undefined {
        return undefined;
      },
      getURL(): string {
        return "";
      },
      propertiesToHash: undefined,
    };
  },
  imageConfig: {},
};
