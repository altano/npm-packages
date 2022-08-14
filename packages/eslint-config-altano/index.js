// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: [
    "eslint-plugin-import",
    "react",
    "react-hooks",
    "@typescript-eslint",
    "prettier",
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {},
    },
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  ignorePatterns: [
    "dist/",
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
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/explicit-function-return-type": ["warn"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-floating-promises": "error",
  },
};
