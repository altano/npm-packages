// @ts-check

import reactPlugin from "eslint-plugin-react";
import * as importPlugin from "eslint-plugin-import";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import packageJson from "eslint-plugin-package-json";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import { includeIgnoreFile } from "@eslint/compat";
import gitignorePath from "./gitignorePath.js";

const compat = new FlatCompat();

export default {
  configs: {
    all: tseslint.config(
      eslint.configs.recommended,

      // typescript-eslint
      ...tseslint.configs.recommendedTypeChecked,
      {
        languageOptions: {
          parserOptions: {
            projectService: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
      },

      // ignore everything in the gitignore
      includeIgnoreFile(gitignorePath),

      ...eslintPluginJsonc.configs["flat/recommended-with-jsonc"],
      ...eslintPluginJsonc.configs["flat/prettier"],

      packageJson.configs.recommended,

      {
        ...prettier,
        rules: {
          ...prettier.rules,
          "prettier/prettier": "off",
        },
      },

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

      // react compiler
      ...compat.config({
        plugins: ["react-compiler"],
        rules: {
          "react-compiler/react-compiler": "error",
        },
      }),

      // react hooks
      // https://github.com/facebook/react/issues/28313
      ...compat.config({
        extends: ["plugin:react-hooks/recommended"],
        rules: {
          "react-hooks/exhaustive-deps": "error",
        },
      }),

      // import: must declare deps
      {
        ...importPlugin.flatConfigs?.recommended,
        rules: {
          "import/no-unresolved": "off",
          "import/no-extraneous-dependencies": [
            "error",
            { devDependencies: false },
          ],
        },
      },

      // disabled rules for dev-only packages
      {
        files: ["packages/build-config/**/*"],
        rules: {
          "import/no-extraneous-dependencies": "off",
        },
      },

      // import: must declare dev deps (dev-only files/dirs)
      {
        ...importPlugin.flatConfigs?.recommended,
        files: [
          "eslint.config.{js,mjs,cjs}",
          "packages/*/*.config.ts",
          "packages/*/tests/**/*",
        ],
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
        // typescript-eslint global rule overrides
        rules: {
          "@typescript-eslint/prefer-promise-reject-errors": "off",
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
        // typescript-eslint rule overrides for tests
        files: ["packages/*/tests/**/*"],
        rules: {
          "@typescript-eslint/require-await": "off",
        },
      },
      {
        // disable type-aware linting on some files
        files: ["**/*.{js,mjs,json,d.ts}"],
        ...tseslint.configs.disableTypeChecked,
      },

      {
        files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
        ...jsxA11y.flatConfigs.recommended,
      },
    ),
  },
};
