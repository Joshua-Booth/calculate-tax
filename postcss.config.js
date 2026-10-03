// Collects every StyleX style into the CSS file that holds the @stylex directive
// (src/app/global.css), in its own cascade layer after the reset.
import { stylexOptions } from "./config/stylex-options.js";

export default {
  plugins: {
    "@stylexjs/postcss-plugin": {
      include: ["src/**/*.{ts,tsx}"],
      // Story-only styles stay out of the site's CSS
      exclude: ["src/**/*.stories.tsx"],
      babelConfig: {
        babelrc: false,
        // Only StyleX runs here, so babel.config.js isn't needed
        configFile: false,
        parserOpts: { plugins: ["typescript", "jsx"] },
        plugins: [["@stylexjs/babel-plugin", stylexOptions]],
      },
      useCSSLayers: true,
    },
  },
};
