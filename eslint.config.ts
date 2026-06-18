import path from "node:path";
import { fileURLToPath } from "node:url";

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import nodePlugin from "eslint-plugin-n";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const eslintConfigDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(
    {
        ignores: ["dist/**", "node_modules/**", "ecosystem.config.cjs"],
    },

    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2022,
            },
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: eslintConfigDirectory,
            },
        },
        plugins: {
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
            "n": nodePlugin,
            sonarjs,
        },
        rules: {
            "eqeqeq": ["error", "always"],
            "default-param-last": "error",
            "dot-notation": "error",
            "no-implicit-coercion": "warn",
            "no-param-reassign": "warn",
            "max-params": ["warn", 2],

            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",

            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],

            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",

            "@typescript-eslint/consistent-type-definitions": "off",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/no-unnecessary-condition": "error",
            "@typescript-eslint/no-unnecessary-type-assertion": "error",
            "@typescript-eslint/no-unsafe-assignment": "error",
            "@typescript-eslint/no-unsafe-member-access": "error",
            "@typescript-eslint/no-unsafe-argument": "error",
            "@typescript-eslint/no-unsafe-return": "error",
            "@typescript-eslint/strict-boolean-expressions": "error",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "@typescript-eslint/return-await": ["error", "in-try-catch"],

            "@typescript-eslint/explicit-function-return-type": [
                "warn",
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                    allowHigherOrderFunctions: true,
                },
            ],

            "n/no-deprecated-api": "warn",
            "n/prefer-node-protocol": "error",

            "sonarjs/cognitive-complexity": ["warn", 10],
            "sonarjs/no-identical-conditions": "error",
            "sonarjs/no-identical-expressions": "error",
            "sonarjs/different-types-comparison": "error",
            "sonarjs/no-duplicate-string": "off",
            "sonarjs/no-commented-code": "warn",
        },
    },

    eslintConfigPrettier,
);
