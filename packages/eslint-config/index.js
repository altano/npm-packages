// @ts-check

import reactPlugin from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import { importX } from "eslint-plugin-import-x";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import packageJson from "eslint-plugin-package-json";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import { includeIgnoreFile } from "@eslint/compat";
import gitignorePath from "./gitignorePath.js";
import turboConfig from "eslint-config-turbo/flat";
import playwright from "eslint-plugin-playwright";
import pluginPnpm from "eslint-plugin-pnpm";
import * as jsoncParser from "jsonc-eslint-parser";
import * as yamlParser from "yaml-eslint-parser";
import { globalIgnores } from "eslint/config";
import eslintPluginYml from "eslint-plugin-yml";
import eslintPluginJsonSchemaValidator from "eslint-plugin-json-schema-validator";

export default {
  configs: {
    all: tseslint.config(
      eslint.configs.recommended,

      ...turboConfig,

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

      globalIgnores(["pnpm-lock.yaml"]),

      ...eslintPluginJsonc.configs["flat/recommended-with-jsonc"],
      ...eslintPluginJsonc.configs["flat/prettier"],

      {
        ...packageJson.configs.recommended,
        ignores: ["**/tests/fixtures/**/package.json"],
      },

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
      reactCompiler.configs.recommended,

      // react hooks
      reactHooks.configs["recommended-latest"],

      {
        rules: {
          "react-hooks/exhaustive-deps": "error",
        },
      },

      // import: must declare deps
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
      {
        files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
        ignores: ["eslint.config.js"],
        rules: {
          "import-x/default": "off",
          "import-x/no-unresolved": "off",
          "import-x/no-named-as-default-member": "off",
          "import-x/no-extraneous-dependencies": [
            "error",
            { devDependencies: false, includeTypes: true },
          ],
        },
      },

      // import: must declare dev deps (dev-only files/dirs)
      {
        files: [
          "eslint.config.{js,mjs,cjs}",
          "packages/*/*.config.ts",
          "packages/*/tests/**/*",
        ],
        rules: {
          "import-x/no-unresolved": "off",
          "import-x/no-extraneous-dependencies": [
            "error",
            { devDependencies: true },
          ],
        },
      },

      // disabled rules for dev-only packages/modules
      {
        files: [
          "packages/build-config/**/*",
          ".syncpackrc.js",
          "packages/**/scripts/**/*",
        ],
        rules: {
          "import-x/no-extraneous-dependencies": "off",
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
        // in non-ts files ...
        files: ["**/*.{js,mjs,json,yml,yaml}"],
        // ... disable type-aware linting
        ...tseslint.configs.disableTypeChecked,
        // ... disable type-syntax-requiring rules
        rules: {
          ...tseslint.configs.disableTypeChecked.rules,
          // https://github.com/typescript-eslint/typescript-eslint/issues/8955
          "@typescript-eslint/explicit-function-return-type": "off",
          "@typescript-eslint/explicit-module-boundary-types": "off",
          "@typescript-eslint/parameter-properties": "off",
        },
      },

      {
        files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
        ...jsxA11y.flatConfigs.recommended,
      },

      {
        ...playwright.configs["flat/recommended"],
        files: ["packages/*/tests/e2e/**/*"],
        rules: {
          ...playwright.configs["flat/recommended"].rules,
          // Customize Playwright rules
          // ...
        },
      },

      {
        name: "pnpm/package.json",
        files: ["package.json", "**/package.json"],
        languageOptions: {
          parser: jsoncParser,
        },
        plugins: {
          pnpm: pluginPnpm,
        },
        rules: {
          "pnpm/json-enforce-catalog": "off",
          "pnpm/json-valid-catalog": "error",
          "pnpm/json-prefer-workspace-settings": "error",
        },
      },
      {
        name: "pnpm/pnpm-workspace-yaml",
        files: ["pnpm-workspace.yaml"],
        languageOptions: {
          parser: yamlParser,
        },
        plugins: {
          pnpm: pluginPnpm,
        },
        rules: {
          "pnpm/yaml-no-unused-catalog-item": "error",
          "pnpm/yaml-no-duplicate-catalog-item": "off",
          "pnpm/yaml-valid-packages": "error",
        },
      },

      // Lint yaml files
      ...eslintPluginYml.configs.recommended,

      // Lint json files by schema
      ...eslintPluginJsonSchemaValidator.configs.recommended,
      {
        rules: {
          "json-schema-validator/no-invalid": "error",
        },
      },
    ),
  },
};
