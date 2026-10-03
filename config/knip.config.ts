import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.{ts,tsx}", "tests/**/*.ts"],

  ignore: [".next/**", "out/**", "coverage/**"],

  ignoreDependencies: [
    // Used via husky pre-commit hook
    "lint-staged",
    // CLI tools run through mise tasks
    "dependency-cruiser",
    "cspell",
    "serve",
    // Loaded by name from the commitlint config
    "commitlint-plugin-selective-scope",
    "commitlint-plugin-function-rules",
  ],

  // System tools (not npm packages)
  ignoreBinaries: ["mise"],

  next: {
    entry: ["next.config.ts", "src/app/**/{layout,page,not-found}.tsx"],
  },

  vitest: {
    config: ["config/vitest.config.ts"],
    entry: ["src/**/*.test.ts"],
  },

  playwright: {
    config: ["config/playwright.config.ts"],
    entry: ["tests/e2e/**/*.spec.ts"],
  },

  eslint: {
    config: ["config/eslint.config.ts"],
  },

  prettier: {
    config: ["config/.prettierrc"],
  },

  stylelint: {
    config: ["config/.stylelintrc.json"],
  },

  cspell: {
    config: ["config/cspell.json"],
  },

  commitlint: {
    config: ["config/commitlint.config.ts", "config/commitlint-ci.config.ts"],
  },

  "lint-staged": {
    config: ["config/.lintstagedrc"],
  },

  typescript: {
    config: ["tsconfig.json", "config/tsconfig.node.json"],
  },

  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
};

export default config;
