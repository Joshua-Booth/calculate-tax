// ESLint, adapted from creact (config/eslint.config.ts) for a Next.js app.
// Dropped from creact: Tailwind, Zod, FSD paths and Node server rules.
// Added: @next/eslint-plugin-next, and the StyleX rules from the personal website.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- ambient module decls for untyped eslint plugins
/// <reference path="./eslint-plugins.d.ts" />
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import eslintReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { rules as stylexRules } from "@stylexjs/eslint-plugin";
import vitest from "@vitest/eslint-plugin";
import barrel from "eslint-plugin-barrel-files";
import baselineJs from "eslint-plugin-baseline-js";
import checkFile from "eslint-plugin-check-file";
import depend from "eslint-plugin-depend";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import promise from "eslint-plugin-promise";
import reactHooks from "eslint-plugin-react-hooks";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import storybook from "eslint-plugin-storybook";
import unicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // JavaScript recommended
  js.configs.recommended,

  // ESLint directive comments best practices
  comments.recommended,
  {
    rules: {
      "@eslint-community/eslint-comments/disable-enable-pair": [
        "error",
        { allowWholeFile: true },
      ],
      "@eslint-community/eslint-comments/require-description": "warn",
    },
  },

  // TypeScript strict type-checked (type-aware linting)
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // React
  eslintReact.configs["strict-typescript"],
  // eslint-plugin-react-hooks stays the source of truth for hooks rules
  eslintReact.configs["disable-conflict-eslint-plugin-react-hooks"],
  reactHooks.configs.flat.recommended,
  reactYouMightNotNeedAnEffect.configs.recommended,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- incomplete types in jsx-a11y
  jsxA11y.flatConfigs.recommended,

  // Next.js
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // StyleX: the same rules as the personal website
  {
    plugins: { "@stylexjs": { rules: stylexRules } },
    rules: {
      "@stylexjs/valid-styles": "off",
      "@stylexjs/valid-shorthands": "error",
      "@stylexjs/no-unused": "error",
      "@stylexjs/no-conflicting-props": "error",
      "@stylexjs/no-legacy-contextual-styles": "error",
      "@stylexjs/enforce-extension": "error",
      "@stylexjs/sort-keys": "off",
      "@stylexjs/no-lookahead-selectors": "error",
      "@stylexjs/no-nonstandard-styles": "error",
    },
  },

  // Promise handling
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- incomplete types in eslint-plugin-promise
  promise.configs["flat/recommended"],

  // Code quality / smells
  // @ts-expect-error -- configs is typed as possibly undefined
  sonarjs.configs.recommended,

  // Security
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- incomplete types
  security.configs.recommended,

  // Storybook
  ...storybook.configs["flat/recommended"],

  // Stories: render callbacks are lowercase functions, so hooks rules would
  // flag the useState and useRef calls some stories need
  {
    files: ["**/*.stories.{ts,tsx}"],
    rules: {
      "@eslint-react/rules-of-hooks": "off",
      "react-hooks/rules-of-hooks": "off",
    },
  },

  // Dependencies: suggest lighter or native alternatives
  // @ts-expect-error -- configs is typed as possibly undefined
  depend.configs["flat/recommended"],

  // Baseline JS (browser compatibility)
  { plugins: { "baseline-js": baselineJs } },
  baselineJs.configs.recommended({ available: "widely", level: "warn" }),

  // Import/export sorting (named items only - statement order handled by Prettier)
  {
    plugins: { perfectionist },
    rules: {
      "perfectionist/sort-named-exports": ["error", { type: "natural" }],
      "perfectionist/sort-named-imports": ["error", { type: "natural" }],
    },
  },

  // JSDoc
  jsdoc.configs["flat/recommended-typescript-flavor"],

  // Base language options
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: ["tsconfig.json", "config/tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname + "/..",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // TypeScript overrides
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "no-unused-vars": "off",
      "no-undef": "off",

      // Relax some strict rules that conflict with React patterns
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: true },
      ],

      // SonarJS tuning
      "sonarjs/cognitive-complexity": ["error", 20],
      "sonarjs/todo-tag": "off",
      "sonarjs/no-hardcoded-passwords": "off",
      "sonarjs/prefer-read-only-props": "off",
      "sonarjs/deprecation": "off",

      // Security - disable overly noisy rules
      "security/detect-object-injection": "off",

      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],

      // Strict boolean expressions - require explicit boolean checks
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: true,
          allowNullableBoolean: true,
          allowNullableString: true,
          allowNullableNumber: false,
          allowNullableEnum: false,
          allowAny: false,
        },
      ],

      // Naming conventions for consistent code style
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "parameter",
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE", "PascalCase"],
        },
        {
          selector: ["objectLiteralProperty", "typeProperty"],
          format: null,
        },
        {
          selector: "import",
          format: null,
        },
      ],

      // JSDoc: TypeScript already provides types in function signatures
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-jsdoc": "off",
    },
  },

  // Unicorn (selective modern JS patterns)
  {
    plugins: { unicorn },
    rules: {
      "unicorn/catch-error-name": "error",
      "unicorn/consistent-function-scoping": "error",
      "unicorn/error-message": "error",
      "unicorn/no-for-each": "error",
      "unicorn/no-array-reduce": "error",
      "unicorn/no-useless-undefined": "error",
      "unicorn/prefer-array-find": "error",
      "unicorn/prefer-array-flat-map": "error",
      "unicorn/prefer-array-some": "error",
      "unicorn/prefer-at": "error",
      "unicorn/prefer-includes": "error",
      "unicorn/prefer-modern-math-apis": "error",
      "unicorn/prefer-negative-index": "error",
      "unicorn/prefer-number-properties": "error",
      "unicorn/prefer-optional-catch-binding": "error",
      "unicorn/prefer-string-replace-all": "error",
      "unicorn/prefer-ternary": "error",
      "unicorn/throw-new-error": "error",
      "unicorn/no-typeof-undefined": "error",
      "unicorn/no-unnecessary-await": "error",
      "unicorn/prefer-date-now": "error",
      "unicorn/prefer-default-parameters": "error",
      "unicorn/prefer-logical-operator-over-ternary": "error",
      "unicorn/prefer-math-min-max": "error",
      "unicorn/prefer-native-coercion-functions": "error",
      "unicorn/prefer-regexp-test": "error",
      "unicorn/prefer-set-has": "error",
      "unicorn/prefer-spread": "error",
      "unicorn/prefer-string-slice": "error",
      "unicorn/prefer-structured-clone": "error",
      "unicorn/prefer-switch": "error",
      "unicorn/require-number-to-fixed-digits-argument": "error",
      "unicorn/no-empty-file": "error",
      "unicorn/no-instanceof-builtins": "error",
      "unicorn/no-static-only-class": "error",
      "unicorn/no-lonely-if": "error",
      "unicorn/no-negated-condition": "error",
      "unicorn/no-nested-ternary": "error",
      "unicorn/consistent-destructuring": "error",
    },
  },

  // Barrel files
  {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- incomplete types
    plugins: { "barrel-files": barrel },
    rules: {
      "barrel-files/avoid-re-export-all": "error",
    },
  },

  // File and folder naming conventions (kebab-case enforcement)
  {
    plugins: { "check-file": checkFile },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        { "src/**/*.{ts,tsx}": "KEBAB_CASE", "tests/**/*.ts": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": [
        "error",
        { "src/**/": "KEBAB_CASE" },
      ],
    },
  },

  // Require JSDoc on the tax and formatting library's public functions
  {
    files: ["src/lib/**/*.ts"],
    ignores: ["**/*.test.*"],
    rules: {
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
    },
  },

  // Unit tests (Vitest)
  {
    files: ["src/**/*.test.{ts,tsx}"],
    ...vitest.configs.recommended,
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/consistent-test-it": ["error", { fn: "it" }],
      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "error",
      "vitest/expect-expect": "error",
      "vitest/no-identical-title": "error",
      "vitest/require-top-level-describe": "error",
      "vitest/no-conditional-expect": "error",
      "vitest/prefer-to-be": "error",
      "vitest/prefer-to-have-length": "error",
      "vitest/prefer-lowercase-title": [
        "error",
        { ignoreTopLevelDescribe: true },
      ],
      "vitest/no-duplicate-hooks": "error",
    },
  },

  // Ignores
  {
    ignores: [
      ".next/**",
      "out/**",
      "storybook-static/**",
      "coverage",
      "test-results",
      "playwright-report",
      "**/*.d.ts",
      "tests/e2e/**",
      "config/.dependency-cruiser.js",
      ".netlify/**",
      ".claude/**",
    ],
  },
]);
