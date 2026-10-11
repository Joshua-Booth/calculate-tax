import type { KnipConfig } from "knip";

const config: KnipConfig = {
  project: ["src/**/*.{ts,tsx}", "tests/**/*.ts"],

  ignore: [".next/**", "out/**", "coverage/**"],

  ignoreDependencies: [
    // Run by lefthook through mise exec, which knip doesn't parse
    "@commitlint/cli",
    // CLI tools run through mise tasks
    "dependency-cruiser",
    "cspell",
    "serve",
    // Loaded by name from the commitlint config
    "commitlint-plugin-selective-scope",
    "commitlint-plugin-function-rules",
    // Loaded by name from babel.config.js, and the peer of the StyleX PostCSS plugin
    "@stylexjs/babel-plugin",
    "postcss",
    // Imported from .storybook/fonts.css, which knip doesn't read
    "@fontsource/lato",
  ],

  // System tools (not npm packages)
  ignoreBinaries: ["mise"],

  next: {
    entry: ["next.config.ts", "src/app/**/{layout,page,not-found}.tsx"],
  },

  vitest: {
    config: ["config/vitest.config.ts", ".storybook/vitest.config.ts"],
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

  typescript: {
    config: ["tsconfig.json", "config/tsconfig.node.json"],
  },

  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
};

export default config;
