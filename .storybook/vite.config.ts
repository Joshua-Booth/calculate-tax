import path from "node:path";

import type { Plugin } from "vite";
import stylex from "@stylexjs/unplugin";
import { defineConfig } from "vite";

import { stylexOptions } from "../config/stylex-options.js";

const rootDir = path.resolve(import.meta.dirname, "..");

// global.css ends with the @stylex directive for Next's PostCSS plugin. Here
// the StyleX Vite plugin adds the CSS itself, so the directive goes.
const dropStylexDirective: Plugin = {
  name: "drop-stylex-directive",
  enforce: "pre",
  transform(code, id) {
    return id.endsWith("/src/app/global.css")
      ? code.replace("@stylex;", "")
      : null;
  },
};

export default defineConfig({
  plugins: [
    dropStylexDirective,
    stylex.vite({
      ...stylexOptions,
      // In dev this CSS can load before global.css, so name the reset layer
      // first here too, or the reset would beat every StyleX style
      useCSSLayers: { before: ["reset"] },
    }),
  ],
  resolve: {
    alias: [
      { find: /^@\/storybook\//, replacement: `${import.meta.dirname}/` },
      { find: /^@\//, replacement: `${path.join(rootDir, "src")}/` },
    ],
  },
  // The StyleX plugin writes the CSS here, so skip postcss.config.js, which
  // does the same job for Next.js
  css: { postcss: {} },
});
