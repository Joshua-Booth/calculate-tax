// Collects every StyleX style into the CSS file that holds the @stylex directive
// (src/app/global.css), in its own cascade layer after the reset.
import babelConfig from "./babel.config.js";

export default {
  plugins: {
    "@stylexjs/postcss-plugin": {
      include: ["src/**/*.{ts,tsx}"],
      babelConfig: {
        babelrc: false,
        parserOpts: { plugins: ["typescript", "jsx"] },
        plugins: babelConfig.plugins,
      },
      useCSSLayers: true,
    },
  },
};
