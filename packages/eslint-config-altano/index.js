// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "prettier",
  ],
  plugins: ["eslint-plugin-import", "react", "react-hooks", "prettier"],
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  ignorePatterns: [
    "dist/",
    ".eslintrc.cjs",
    "node_modules/",
    "rollup.config.js",
    "__fixtures__/",
  ],
  rules: {
    "react/jsx-filename-extension": [
      "error",
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-console": "error",
    "react/react-in-jsx-scope": "off",
  },
  overrides: [
    {
      // Rules that only apply to ts files
      files: ["**/*.{ts,tsx}"],
      extends: [
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: ["./tsconfig.json"],
        tsconfigRootDir: ".",
      },
      plugins: ["@typescript-eslint"],
      settings: {
        "import/parsers": {
          "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
          typescript: {},
        },
      },
      rules: {
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          {
            allowTypedFunctionExpressions: true,
            allowExpressions: true,
          },
        ],
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/no-floating-promises": "error",
      },
    },
    {
      files: ["**/*.d.ts"],
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
    },
    {
      files: ["package.json"],
      extends: ["plugin:package-json/recommended"],
      parser: "jsonc-eslint-parser",
      plugins: ["package-json"],
      rules: {
        "package-json/valid-version": "off",
        "package-json/valid-package-def": "off",
      },
    },
  ],
};
