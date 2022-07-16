export interface RemarkAstroJSImageUseComponentOptions {
  /**
   * Convert ![]() style markdown images to AstroJS' Image component
   *
   * @default true
   */
  convertMarkdownImages?: boolean;
  /**
   * Convert <img> jsx images to AstroJS' Image component
   *
   * @default true
   */
  convertJsxImages?: boolean;
  /**
   * Convert <picture> jsx pictures to AstroJS' Picture component
   *
   * @default true
   */
  convertJsxPictures?: boolean;
}

export type RemarkAstroJSImageUseComponentConfig =
  Required<RemarkAstroJSImageUseComponentOptions>;

const configDefaults: RemarkAstroJSImageUseComponentConfig = {
  convertMarkdownImages: true,
  convertJsxImages: true,
  convertJsxPictures: true,
};

// import type { Element } from "hast";
export function getConfig(
  options: RemarkAstroJSImageUseComponentOptions,
): RemarkAstroJSImageUseComponentConfig {
  return Object.assign(configDefaults, options);
}
