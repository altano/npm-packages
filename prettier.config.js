/**
 * @type {import("prettier").Config}
 * @see https://prettier.io/docs/configuration
 */
export default {
  printWidth: 80,
  semi: true,
  trailingComma: "all",
  jsdocPrintWidth: 80,
  plugins: ["prettier-plugin-jsdoc"],
  overrides: [
    {
      files: [".depcheckrc"],
      options: {
        parser: "yaml",
      },
    },
  ],
};
