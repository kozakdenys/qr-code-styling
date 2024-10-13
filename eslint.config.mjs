// @ts-check

import eslint from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["**/coverage/**", "**/lib/**", "**/node_modules/**", ".*", "**/*.json", "**/*.md"],
  },
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    // disable type-aware linting on JS files
    files: ["**/*.js"],
    ...tseslint.configs.disableTypeChecked
  },
  {
    // enable jest rules on test files
    files: ["**/*.test.*"],
    ...jestPlugin.configs["flat/recommended"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
      }
    }
  },
  {
    // allow module.exports and require for config files
    files: ["*.*"],
    rules: {
      "@typescript-eslint/no-require-imports": 0,
    },
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node
      },
    }
  }
);
