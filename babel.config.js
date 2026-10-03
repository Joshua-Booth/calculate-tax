// StyleX compiles styles at build time. Next.js runs app code through this;
// next/font still goes through SWC. Mirrors the setup on joshuabooth.nz.
import { stylexOptions } from "./config/stylex-options.js";

/**
 * @param {{ caller: (read: (caller?: { name: string }) => boolean) => boolean }} api - Babel's config API
 * @returns {object} The config for whichever tool is running Babel
 */
export default function babelConfig(api) {
  // Storybook's StyleX Vite plugin runs its own Babel pass with StyleX built
  // in, and Babel still loads this file for it, so give that pass nothing
  // eslint-disable-next-line baseline-js/use-baseline -- Babel's api.caller, not Function.prototype.caller
  const isStorybookStylex = api.caller(
    (caller) => caller?.name === "@stylexjs/unplugin"
  );
  if (isStorybookStylex) return {};

  return {
    presets: ["next/babel"],
    plugins: [["@stylexjs/babel-plugin", stylexOptions]],
  };
}
