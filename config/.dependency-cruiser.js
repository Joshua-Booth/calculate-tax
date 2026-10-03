/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Circular dependencies can lead to hard-to-debug issues and should be avoided.",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphans",
      severity: "error",
      comment: "A module nothing imports is probably dead code.",
      from: {
        orphan: true,
        pathNot: [
          "(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|cts|mts|json)$",
          "\\.d\\.ts$",
          "^src/app/(layout|page|not-found)\\.tsx$",
          "\\.test\\.ts$",
        ],
      },
      to: {},
    },
    {
      name: "lib-stays-pure",
      severity: "error",
      comment:
        "The tax and format library has no UI, so it can be tested and reused on its own.",
      from: { path: "^src/lib" },
      to: { path: "^src/(components|app)" },
    },
    {
      name: "not-to-unresolvable",
      severity: "error",
      comment: "This module depends on a module that cannot be found.",
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: "no-non-package-json",
      severity: "error",
      comment:
        "This module depends on an npm package that isn't in package.json.",
      from: {},
      to: { dependencyTypes: ["npm-no-pkg", "npm-unknown"] },
    },
    {
      name: "not-to-dev-dep",
      severity: "error",
      comment:
        "App code must not import devDependencies; they aren't installed in production builds.",
      from: { path: "^src", pathNot: "\\.test\\.ts$" },
      to: { dependencyTypes: ["npm-dev"] },
    },
  ],
  options: {
    doNotFollow: { path: ["node_modules"] },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
    },
  },
};
