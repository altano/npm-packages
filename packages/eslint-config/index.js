// @ts-check

import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import packageJson from "eslint-plugin-package-json/configs/recommended";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import { includeIgnoreFile } from "@eslint/compat";
import gitignorePath from "./gitignorePath.js";

const compat = new FlatCompat();

export default {
  configs: {
    all: tseslint.config(
      eslint.configs.recommended,
      ...tseslint.configs.recommended,

      // ignore everything in the gitignore
      includeIgnoreFile(gitignorePath),

      ...eslintPluginJsonc.configs["flat/recommended-with-jsonc"],
      ...eslintPluginJsonc.configs["flat/prettier"],

      packageJson,

      prettier,

      // react
      {
        ...reactPlugin.configs.flat.recommended,
        ...reactPlugin.configs.flat["jsx-runtime"],
        settings: {
          react: {
            version: "detect",
          },
        },
      },

      // react-hooks
      // https://github.com/facebook/react/issues/28313
      ...compat.config({
        extends: ["plugin:react-hooks/recommended"],
        rules: {
          "react-hooks/exhaustive-deps": "error",
        },
      }),

      // import
      {
        ...importPlugin.flatConfigs.recommended,
        rules: {
          "import/no-unresolved": "off",
          "import/no-extraneous-dependencies": [
            "error",
            { devDependencies: true },
          ],
        },
      },

      {
        rules: {
          "no-console": "error",
        },
      },

      // typescript-eslint customization
      {
        files: ["**/*.{ts,tsx,mts,cts}"],
        languageOptions: {
          parserOptions: {
            projectService: true,
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
            {
              argsIgnorePattern: "^_",
              varsIgnorePattern: "^_",
              caughtErrors: "none",
            },
          ],
          "@typescript-eslint/no-floating-promises": "error",
        },
      },
      {
        // disable type-aware linting on .d.ts files
        files: ["**/*.d.ts"],
        ...tseslint.configs.disableTypeChecked,
      },

      {
        files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
        ...jsxA11y.flatConfigs.recommended,
      },
    ),
  },
};
