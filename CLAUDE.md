@AGENTS.md

# Calculate Tax

- Run everything through mise: `mise run <task>`. See `mise.toml` for the list. `mise run check` runs every CI check.
- The tax rules live in `src/lib/tax.ts` as plain functions with no UI. Every rate cites Inland Revenue. Change a rate only with its IRD source, and keep `src/lib` at 100% test coverage.
- `src/lib` must not import from `src/components` or `src/app` (dependency-cruiser enforces it).
- Styles are StyleX, set up the same way as my personal website: `stylex.create` next to each component, and the design tokens in `src/styles/tokens.stylex.ts`. Don't hard-code colours or spacing a token covers.
- `src/app/global.css` only holds the reset and the `@stylex` directive. Give an element a stable hook class with `sx()` from `src/styles/sx.ts` when a test or plain CSS needs to find it.
- Every component has stories next to it (`*.stories.tsx`) with play tests and an axe check. Add or update them with any UI change, and link each to its Figma frame with `figma()` from `.storybook/figma.ts`. `mise run test:storybook` runs them.
- With `mise run storybook` running, the Storybook MCP server (`.mcp.json`) gives component docs and runs story tests. Use it to look up props rather than reading the source.
- Commits follow the commitlint rules in `config/commitlint.config.ts`: imperative mood, specific verbs, no `#123` issue references.
- Before calling UI work done, run `mise run test:e2e`. It checks every screen width from 320 to 1920 for overflow and clipped text.
