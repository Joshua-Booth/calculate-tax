<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- git-workflow:start -->

## Commits

- Commits use Conventional Commits with a lowercase imperative subject, checked by commitlint. Don't skip the hooks.
- Before the first commit in a fresh clone, install the hooks with `pnpm install`.
- Commits on a branch get a short body with context. PRs are squash-merged, so main gets one subject-only commit.

<!-- git-workflow:end -->

## Pull requests

- Don't put Claude session links in PR descriptions or commit messages.
- When a change affects what people see or do on screen, put screenshots in the PR description. Show before and after when something changed.
