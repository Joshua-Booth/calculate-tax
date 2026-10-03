import path from "node:path";

import { defineConfig, devices } from "@playwright/test";

const rootDir = path.resolve(import.meta.dirname, "..");
const port = 4173;

// Runs against the static export in out/, the same files Netlify serves. Build first.
export default defineConfig({
  testDir: path.join(rootDir, "tests/e2e"),
  outputDir: path.join(rootDir, "test-results"),
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://localhost:${port}`,
    headless: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  reporter: [
    ...(process.env.CI ? [["github"] as const] : []),
    [
      "html",
      { outputFolder: path.join(rootDir, "playwright-report"), open: "never" },
    ],
  ],
  projects: [
    {
      name: "desktop-chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 960 },
      },
    },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 15"] } },
    { name: "desktop-firefox", use: { ...devices["Desktop Firefox"] } },
  ],
  webServer: {
    command: `pnpm exec serve out -l ${port} -n`,
    cwd: rootDir,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
