// StyleX compiler options, shared by Next.js (babel.config.js) and Storybook
// (.storybook/vite.config.ts) so both builds produce the same class names.
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");

/** @satisfies {Partial<import("@stylexjs/babel-plugin").Options>} */
export const stylexOptions = {
  dev: process.env.NODE_ENV !== "production",
  runtimeInjection: false,
  enableInlinedConditionalMerge: true,
  treeshakeCompensation: true,
  aliases: { "@/*": [path.join(rootDir, "src", "*")] },
  unstable_moduleResolution: { type: "commonJS", rootDir },
};
