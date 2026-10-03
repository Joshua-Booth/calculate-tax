import path from "node:path";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

// Runs every story as a test in Chromium: it renders, its play function
// passes, and axe finds no accessibility issues
export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [storybookTest({ configDir: import.meta.dirname })],
    test: {
      name: "storybook",
      root: path.resolve(import.meta.dirname, ".."),
      setupFiles: [path.join(import.meta.dirname, "vitest.setup.ts")],
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({}),
        instances: [{ browser: "chromium" }],
      },
    },
  })
);
