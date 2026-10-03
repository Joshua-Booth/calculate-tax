@AGENTS.md

# Calculate Tax

- Run everything through mise: `mise run <task>`. See `mise.toml` for the list. `mise run check` runs every CI check.
- The tax rules live in `src/lib/tax.ts` as plain functions with no UI. Every rate cites Inland Revenue. Change a rate only with its IRD source, and keep `src/lib` at 100% test coverage.
- `src/lib` must not import from `src/components` or `src/app` (dependency-cruiser enforces it).
- Styles use the design tokens in `src/app/tokens.css`, which mirror the Web collection in the Figma file (page "🛠 2026 build"). Don't hard-code colours or spacing a token covers.
- Commits follow the commitlint rules in `config/commitlint.config.ts`: imperative mood, specific verbs, no `#123` issue references.
- Before calling UI work done, run `mise run test:e2e`. It checks every screen width from 320 to 1920 for overflow and clipped text.
