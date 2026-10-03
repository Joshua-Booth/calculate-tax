import { defineMain } from "@storybook/react-vite/node";

// Adapted from creact's Storybook: Vite, docs, a11y checks, component tests
// through Vitest, the MCP server for agents, and Figma frames beside each story.
export default defineMain({
  stories: ["../src/**/*.mdx", "../src/**/*.stories.tsx"],
  staticDirs: ["../public"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-mcp",
    "@storybook/addon-designs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: ".storybook/vite.config.ts",
      },
    },
  },
  core: {
    disableTelemetry: true,
  },
  features: {
    experimentalTestSyntax: true,
    componentsManifest: true,
  },
});
