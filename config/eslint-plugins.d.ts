declare module "eslint-plugin-barrel-files";
declare module "eslint-plugin-jsx-a11y";
declare module "eslint-plugin-promise";
declare module "eslint-plugin-security";
declare module "@next/eslint-plugin-next" {
  import type { ESLint, Linter } from "eslint";

  const plugin: ESLint.Plugin & {
    configs: Record<
      "recommended" | "core-web-vitals",
      { rules: Linter.RulesRecord }
    >;
  };
  export default plugin;
}
