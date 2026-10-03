import path from "node:path";

import { defineConfig } from "vitest/config";

const root = path.resolve(import.meta.dirname, "..");

export default defineConfig({
  resolve: {
    alias: { "@": path.join(root, "src") },
  },
  test: {
    name: "unit",
    root,
    include: ["src/**/*.test.ts"],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      include: ["src/lib/**"],
      exclude: ["**/*.test.ts"],
      reportsDirectory: "coverage/unit",
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
